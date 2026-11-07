import os
import sys
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Depends, Header, Request, status
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from datetime import datetime, timedelta

from database import init_db
from security import create_admin_token, verify_admin_token
from models import LicenseManager, PaymentManager, ClientManager, SettingsManager, AdminManager

# Initialisation DB et Admin par défaut
init_db()
AdminManager.ensure_default_admin()

app = FastAPI(
    title="PR.Social Bot - Licensing & Payments Server",
    description="API de contrôle des licences hebdomadaires (2 USD / 7 jours), paiements MVola & USDT et dashboard admin.",
    version="1.0.0"
)

# Activer CORS pour permettre les requêtes depuis tout client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.middleware("http")
async def add_no_cache_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(SERVER_DIR, "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ==============================================================================
# PYDANTIC SCHEMAS
# ==============================================================================
class LicenseVerifyRequest(BaseModel):
    license_key: str = Field(..., example="PR-XXXX-XXXX-XXXX")
    device_id: str = Field(..., example="android_9a8b7c6d5e4f")

class LicenseActivateRequest(BaseModel):
    license_key: str = Field(..., example="PR-XXXX-XXXX-XXXX")
    device_id: str = Field(..., example="android_9a8b7c6d5e4f")
    device_info: Optional[str] = Field(default="", example="Xiaomi Redmi Note 12 - Android 14")
    contact: Optional[str] = Field(default="", example="+261 34 00 000 00 / @telegram_user")

class PaymentSubmitRequest(BaseModel):
    method: str = Field(..., example="MVOLA") # MVOLA ou USDT
    transaction_ref: str = Field(..., example="MV241030.1234.A12345")
    sender_contact: str = Field(..., example="034 12 345 67")
    amount_usd: Optional[float] = Field(default=2.0)
    amount_local: Optional[str] = Field(default="9 500 MGA")
    notes: Optional[str] = Field(default="")

class AdminLoginRequest(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="Admin1234!")

class LicenseGenerateRequest(BaseModel):
    count: int = Field(default=1, ge=1, le=50)
    duration_days: int = Field(default=7, ge=1)
    notes: Optional[str] = Field(default="")
    client_contact: Optional[str] = Field(default="")

class LicenseExtendRequest(BaseModel):
    extra_days: int = Field(default=7, ge=1)

class RejectPaymentRequest(BaseModel):
    reason: Optional[str] = Field(default="Référence de transaction introuvable ou invalide")

class SettingsUpdateRequest(BaseModel):
    settings: Dict[str, str]

# ==============================================================================
# SÉCURITÉ ADMIN DEPENDENCY
# ==============================================================================
def require_admin(authorization: Optional[str] = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token d'administration manquant ou invalide")
    token = authorization[7:].strip()
    user = verify_admin_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expirée ou token non reconnu")
    return user

# ==============================================================================
# 1. ENDPOINTS PUBLICS CLIENT TERMUX (LICENCES & PAIEMENTS)
# ==============================================================================
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "PR.Social License Server", "version": "1.0.0"}

@app.post("/api/v1/license/verify")
def verify_license(req: LicenseVerifyRequest):
    """
    Appelé par le bot Termux à chaque démarrage pour valider l'accès.
    Vérifie l'existence, le statut, le verrouillage de l'appareil (device_id) et l'expiration.
    """
    valid, message, info = LicenseManager.verify_license(req.license_key, req.device_id)
    return {
        "ok": valid,
        "is_valid": valid,
        "message": message,
        "info": info
    }

@app.post("/api/v1/license/activate")
def activate_license(req: LicenseActivateRequest):
    """
    Appelé par l'utilisateur dans le menu Termux pour activer sa clé ou la prolonger.
    Lie l'appareil (Device ID) à la licence.
    """
    ok, message, info = LicenseManager.activate_or_renew(
        key=req.license_key,
        device_id=req.device_id,
        device_info=req.device_info or "",
        contact=req.contact or ""
    )
    return {
        "ok": ok,
        "message": message,
        "info": info
    }

@app.get("/api/v1/payment/instructions")
def get_payment_instructions():
    """
    Renvoie les informations de paiement nécessaires à l'utilisateur :
    Coordonnées MVola, adresse USDT TRC20, prix et taux de change.
    """
    settings = SettingsManager.get_all()
    return {
        "ok": True,
        "price_usd": float(settings.get("price_usd", "2.00")),
        "duration_days": int(settings.get("duration_days", "7")),
        "mvola": {
            "number": settings.get("mvola_number", ""),
            "name": settings.get("mvola_name", ""),
            "rate_mga": settings.get("mvola_rate_mga", "9500"),
            "amount_to_pay": f"{settings.get('mvola_rate_mga', '9500')} MGA"
        },
        "usdt": {
            "address": settings.get("usdt_address", ""),
            "network": settings.get("usdt_network", "TRC-20 (Tron)"),
            "amount_to_pay": f"{settings.get('price_usd', '2.00')} USDT"
        },
        "support": settings.get("support_telegram", "")
    }

@app.post("/api/v1/payment/submit")
def submit_payment_proof(req: PaymentSubmitRequest):
    """
    Permet à l'utilisateur de soumettre sa preuve de paiement (MVola réf SMS ou TxHash crypto).
    """
    ok, msg, payment_data = PaymentManager.submit_payment(
        method=req.method,
        transaction_ref=req.transaction_ref,
        sender_contact=req.sender_contact,
        amount_usd=req.amount_usd or 2.0,
        amount_local=req.amount_local or "",
        notes=req.notes or ""
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg, "payment": payment_data}

# ==============================================================================
# 2. ENDPOINTS PRIVÉS ADMINISTRATION WEB
# ==============================================================================
@app.post("/api/admin/login")
def admin_login(req: AdminLoginRequest):
    if not AdminManager.authenticate(req.username, req.password):
        raise HTTPException(status_code=401, detail="Identifiants administrateur incorrects.")
    token = create_admin_token(req.username)
    return {"ok": True, "token": token, "username": req.username}

@app.get("/api/admin/stats")
def get_admin_stats(admin: str = Depends(require_admin)):
    licenses = LicenseManager.list_all()
    payments = PaymentManager.list_all()
    clients = ClientManager.list_all()

    now = datetime.now()
    now_month_str = now.strftime("%Y-%m")

    active_licenses = sum(1 for l in licenses if l.get("status") == "ACTIVE")
    unused_licenses = sum(1 for l in licenses if l.get("status") == "UNUSED")
    expired_licenses = sum(1 for l in licenses if l.get("status") == "EXPIRED")
    revoked_licenses = sum(1 for l in licenses if l.get("status") == "REVOKED")

    pending_payments = sum(1 for p in payments if p.get("status") == "PENDING")
    approved_payments = sum(1 for p in payments if p.get("status") == "APPROVED")
    rejected_payments = sum(1 for p in payments if p.get("status") == "REJECTED")

    pending_mvola = sum(1 for p in payments if p.get("status") == "PENDING" and p.get("method") == "MVOLA")
    pending_usdt = sum(1 for p in payments if p.get("status") == "PENDING" and p.get("method") == "USDT")

    new_clients_this_month = sum(1 for c in clients if (c.get("first_seen") or "").startswith(now_month_str))

    expiring_this_week = 0
    for l in licenses:
        if l.get("status") == "ACTIVE" and l.get("expires_at"):
            try:
                exp_dt = datetime.strptime(l["expires_at"], "%Y-%m-%d %H:%M:%S")
                if 0 <= (exp_dt - now).total_seconds() <= 7 * 86400:
                    expiring_this_week += 1
            except Exception:
                pass

    total_revenue_usd = sum(p.get("amount_usd", 0) for p in payments if p.get("status") == "APPROVED")
    revenue_this_month = sum(p.get("amount_usd", 0) for p in payments if p.get("status") == "APPROVED" and (p.get("created_at") or "").startswith(now_month_str))

    sales_7_days = []
    for i in range(6, -1, -1):
        d = now - timedelta(days=i)
        d_iso = d.strftime("%Y-%m-%d")
        d_label = d.strftime("%d/%m")
        day_payments = [p for p in payments if p.get("status") == "APPROVED" and (p.get("created_at") or "").startswith(d_iso)]
        total_day = sum(p.get("amount_usd", 0) for p in day_payments)
        sales_7_days.append({
            "date": d_label,
            "iso": d_iso,
            "amount": round(total_day, 2),
            "count": len(day_payments)
        })

    approved_list = [p for p in payments if p.get("status") == "APPROVED"]
    total_usdt = sum(p.get("amount_usd", 0) for p in approved_list if p.get("method") == "USDT")
    total_mvola = sum(p.get("amount_usd", 0) for p in approved_list if p.get("method") == "MVOLA")
    total_approved = total_usdt + total_mvola
    pct_usdt = round((total_usdt / total_approved) * 100) if total_approved > 0 else 0
    pct_mvola = round((total_mvola / total_approved) * 100) if total_approved > 0 else 0

    return {
        "ok": True,
        "stats": {
            "active_licenses": active_licenses,
            "unused_licenses": unused_licenses,
            "expired_licenses": expired_licenses,
            "revoked_licenses": revoked_licenses,
            "total_licenses": len(licenses),
            "pending_payments": pending_payments,
            "approved_payments": approved_payments,
            "rejected_payments": rejected_payments,
            "pending_mvola": pending_mvola,
            "pending_usdt": pending_usdt,
            "total_clients": len(clients),
            "new_clients_this_month": new_clients_this_month,
            "expiring_this_week": expiring_this_week,
            "total_revenue_usd": round(total_revenue_usd, 2),
            "revenue_this_month": round(revenue_this_month, 2),
            "sales_7_days": sales_7_days,
            "distribution": {
                "total_usdt": round(total_usdt, 2),
                "total_mvola": round(total_mvola, 2),
                "total": round(total_approved, 2),
                "pct_usdt": pct_usdt,
                "pct_mvola": pct_mvola
            }
        }
    }

@app.get("/api/admin/licenses")
def get_admin_licenses(admin: str = Depends(require_admin)):
    return {"ok": True, "licenses": LicenseManager.list_all()}

@app.post("/api/admin/licenses/generate")
def generate_licenses(req: LicenseGenerateRequest, admin: str = Depends(require_admin)):
    created = []
    for _ in range(req.count):
        lic = LicenseManager.create_license(
            duration_days=req.duration_days,
            notes=req.notes or f"Généré manuellement par {admin}",
            client_contact=req.client_contact or ""
        )
        created.append(lic)
    return {"ok": True, "created": created, "count": len(created)}

@app.post("/api/admin/licenses/{license_id}/revoke")
def revoke_license(license_id: int, admin: str = Depends(require_admin)):
    LicenseManager.revoke(license_id)
    return {"ok": True, "message": f"Licence #{license_id} révoquée avec succès."}

@app.post("/api/admin/licenses/{license_id}/reactivate")
def reactivate_license(license_id: int, admin: str = Depends(require_admin)):
    LicenseManager.reactivate(license_id)
    return {"ok": True, "message": f"Licence #{license_id} réactivée avec succès."}

@app.delete("/api/admin/licenses/{license_id}")
def delete_license(license_id: int, admin: str = Depends(require_admin)):
    LicenseManager.delete(license_id)
    return {"ok": True, "message": f"Licence #{license_id} définitivement supprimée."}

@app.post("/api/admin/licenses/{license_id}/extend")
def extend_license(license_id: int, req: LicenseExtendRequest, admin: str = Depends(require_admin)):
    updated = LicenseManager.extend(license_id, req.extra_days)
    if not updated:
        raise HTTPException(status_code=404, detail="Licence introuvable.")
    return {"ok": True, "message": f"Licence #{license_id} prolongée de {req.extra_days} jours.", "license": updated}

@app.get("/api/admin/payments")
def get_admin_payments(admin: str = Depends(require_admin)):
    return {"ok": True, "payments": PaymentManager.list_all()}

@app.post("/api/admin/payments/{payment_id}/approve")
def approve_payment(payment_id: int, admin: str = Depends(require_admin)):
    ok, msg, license_key = PaymentManager.approve_payment(payment_id)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg, "license_key": license_key}

@app.post("/api/admin/payments/{payment_id}/reject")
def reject_payment(payment_id: int, req: RejectPaymentRequest, admin: str = Depends(require_admin)):
    PaymentManager.reject_payment(payment_id, req.reason or "")
    return {"ok": True, "message": f"Paiement #{payment_id} rejeté."}

@app.get("/api/admin/clients")
def get_admin_clients(admin: str = Depends(require_admin)):
    return {"ok": True, "clients": ClientManager.list_all()}

@app.get("/api/admin/settings")
def get_admin_settings(admin: str = Depends(require_admin)):
    return {"ok": True, "settings": SettingsManager.get_all()}

@app.post("/api/admin/settings")
def update_admin_settings(req: SettingsUpdateRequest, admin: str = Depends(require_admin)):
    for k, v in req.settings.items():
        SettingsManager.update(k, v)
    return {"ok": True, "message": "Paramètres mis à jour avec succès.", "settings": SettingsManager.get_all()}

# ==============================================================================
# 3. INTERFACE WEB D'ADMINISTRATION
# ==============================================================================
@app.get("/", response_class=HTMLResponse)
@app.get("/admin", response_class=HTMLResponse)
def serve_admin_dashboard():
    html_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            c = f.read()
            c = c.replace("/static/app.js", f"/static/app.js?v={int(datetime.now().timestamp())}")
            c = c.replace("/static/style.css", f"/static/style.css?v={int(datetime.now().timestamp())}")
            return HTMLResponse(content=c, headers={
                "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0"
            })
    return HTMLResponse(content="<h1>Administration PR.Social</h1><p>Fichiers statiques en cours d'initialisation...</p>")
