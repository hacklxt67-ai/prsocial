import os
import sys
import hmac
import hashlib
import secrets
from urllib.parse import urlparse
from fastapi import FastAPI, Depends, HTTPException, Header, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse, RedirectResponse
from typing import Optional, List, Dict, Any

from database import init_db, query_one, query_all, execute_commit
from security import SecurityHelper
from schemas import (
    UserRegisterRequest, UserLoginRequest, TokenResponse,
    SocialAccountCreate, CampaignCreateRequest, TaskStartRequest,
    TaskProofSubmitRequest, DepositRequest, WithdrawalRequest
)
from services.wallet_service import WalletService
from services.task_engine import TaskDistributionEngine
from services.verification_engine import VerificationEngine
from services.email_service import is_valid_email, issue_verification_email
from pr_endpoints import router as pr_router

# Initialisation de la base de données
init_db()

app = FastAPI(
    title="L-Marchande Enterprise API",
    description="Plateforme d'engagement social & distribution de tâches haute performance",
    version="1.0.0"
)

# Configuration CORS restreinte (jamais "*" avec allow_credentials=True)
ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get(
        "L_MARCHANDE_CORS_ORIGINS",
        "http://localhost:8000,http://127.0.0.1:8000"
    ).split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Webhook-Signature"],
)

# Protection CSRF sur les requêtes mutantes authentifiées par cookie
@app.middleware("http")
async def csrf_origin_guard(request: Request, call_next):
    if request.method in ("POST", "PUT", "PATCH", "DELETE"):
        has_cookie = bool(request.cookies.get("pr_token"))
        has_bearer = bool(request.headers.get("authorization"))
        is_webhook = request.url.path.startswith("/api/wallet/webhook/")
        if has_cookie and not has_bearer and not is_webhook:
            origin = request.headers.get("origin")
            referer = request.headers.get("referer")
            check_url = origin or referer
            if check_url:
                parsed = urlparse(check_url)
                req_origin = f"{parsed.scheme}://{parsed.netloc}"
                host_origin = f"{request.url.scheme}://{request.headers.get('host', '')}"
                if req_origin not in ALLOWED_ORIGINS and req_origin != host_origin:
                    return JSONResponse({"detail": "Requête bloquée par la protection CSRF (Origin invalide)."}, status_code=403)
    return await call_next(request)

# Répertoire du frontend
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# ==============================================================================
# AUTHENTICATION DEPENDENCY
# ==============================================================================
def get_current_user(request: Request, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Extrait et valide l'utilisateur actuel via Bearer token ou cookie pr_token."""
    token = None
    if authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
    if not token:
        token = request.cookies.get("pr_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token d'authentification manquant.")

    payload = SecurityHelper.verify_jwt(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expirée ou token invalide.")

    user = query_one("SELECT * FROM users WHERE id = ?", (payload["sub"],))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Utilisateur inexistant.")

    if user["is_banned"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Compte suspendu : {user.get('ban_reason') or 'Infraction aux règles'}")

    return user

def get_admin_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Vérifie que l'utilisateur possède les privilèges administrateur."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Privilèges d'administration requis.")
    return current_user

# ==============================================================================
# 1. AUTHENTICATION ENDPOINTS
# ==============================================================================
@app.post("/api/auth/register", response_model=TokenResponse)
def register(req: UserRegisterRequest, request: Request, response: Response):
    if not is_valid_email(req.email):
        raise HTTPException(status_code=400, detail="Format d'adresse e-mail invalide.")
    # Vérifier l'unicité de l'email et du pseudo
    if query_one("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (req.email,)):
        raise HTTPException(status_code=400, detail="Cette adresse email est déjà enregistrée.")
    if query_one("SELECT id FROM users WHERE LOWER(username) = LOWER(?)", (req.username,)):
        raise HTTPException(status_code=400, detail="Ce nom d'utilisateur est déjà utilisé.")

    # Parrainage
    referred_by_id = None
    ref_code_in = req.referral_code or req.ref
    if ref_code_in:
        sponsor = query_one("SELECT id FROM users WHERE referral_code = ?", (ref_code_in.strip().upper(),))
        if sponsor:
            referred_by_id = sponsor["id"]

    requested_role = (req.role or "worker").strip().lower()
    if requested_role not in ("worker", "advertiser"):
        raise HTTPException(status_code=403, detail="Rôle non autorisé lors de l'inscription.")

    client_ip = request.client.host if request.client else "127.0.0.1"
    hashed_pwd = SecurityHelper.hash_password(req.password)
    new_ref_code = SecurityHelper.generate_referral_code("LM")

    user_id = execute_commit("""
        INSERT INTO users (email, username, hashed_password, role, email_verified, referral_code, referred_by, last_ip)
        VALUES (?, ?, ?, ?, 0, ?, ?, ?)
    """, (req.email.strip().lower(), req.username.strip(), hashed_pwd, requested_role, new_ref_code, referred_by_id, client_ip))

    # Envoyer un vrai e-mail de vérification (token 24h)
    issue_verification_email(user_id, req.email.strip().lower(), base_url=str(request.base_url), enforce_cooldown=False)

    user = query_one("SELECT * FROM users WHERE id = ?", (user_id,))
    token = SecurityHelper.create_jwt({"sub": user_id, "username": user["username"], "role": user["role"]})

    # Nettoyage mot de passe avant retour
    user_data = dict(user)
    user_data.pop("hashed_password", None)
    response.set_cookie("pr_token", token, httponly=True, samesite="lax", path="/", max_age=86400*30)

    return {"ok": True, "access_token": token, "token_type": "bearer", "user": user_data}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(req: UserLoginRequest, request: Request, response: Response):
    ident = (req.username_or_email or req.email or "").strip()
    user = query_one("""
        SELECT * FROM users WHERE username = ? OR email = ?
    """, (ident, ident))

    if not user or not SecurityHelper.verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Identifiants incorrects.")

    if user["is_banned"]:
        raise HTTPException(status_code=403, detail=f"Compte suspendu : {user.get('ban_reason') or 'Fraude détectée'}")

    client_ip = request.client.host if request.client else "127.0.0.1"
    execute_commit("UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_ip = ? WHERE id = ?", (client_ip, user["id"]))

    token = SecurityHelper.create_jwt({"sub": user["id"], "username": user["username"], "role": user["role"]})
    user_data = dict(user)
    user_data.pop("hashed_password", None)
    response.set_cookie("pr_token", token, httponly=True, samesite="lax", path="/", max_age=86400*30)

    return {"ok": True, "access_token": token, "token_type": "bearer", "user": user_data}

@app.get("/api/auth/me")
def me(current_user: Dict[str, Any] = Depends(get_current_user)):
    user_data = dict(current_user)
    user_data.pop("hashed_password", None)
    return {**user_data, "ok": True, "user": user_data}

# ==============================================================================
# 2. PROFILE & WARNINGS (Socials handled in pr_endpoints.py)
# ==============================================================================
@app.get("/api/profile/warnings")
def get_warnings(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {
        "warning_strikes": current_user["warning_strikes"],
        "trust_score": current_user["trust_score"],
        "is_banned": bool(current_user["is_banned"]),
        "status": "clean" if current_user["warning_strikes"] == 0 else "flagged"
    }

@app.get("/api/profile/wallet")
def get_wallet(current_user: Dict[str, Any] = Depends(get_current_user)):
    txs = query_all("""
        SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 50
    """, (current_user["id"],))
    return {
        "balance": current_user["balance"],
        "hold_balance": current_user["hold_balance"],
        "transactions": txs
    }

# ==============================================================================
# 3. TASKS & WORKER MISSIONS
# ==============================================================================
@app.get("/api/tasks")
@app.get("/api/tasks/")
def get_available_tasks(
    platform: Optional[str] = "all",
    sort: str = "reward",
    limit: int = 50,
    page: int = 1,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    return TaskDistributionEngine.get_available_tasks(
        worker_id=current_user["id"],
        platform=platform,
        sort=sort,
        limit=limit,
        page=page
    )

@app.post("/api/tasks/{campaign_id}/start")
def start_task(campaign_id: int, req: TaskStartRequest, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    client_ip = request.client.host if request.client else "127.0.0.1"
    ok, msg, execution = TaskDistributionEngine.claim_task(
        campaign_id=campaign_id,
        worker_id=current_user["id"],
        social_account_id=req.social_account_id,
        ip_address=client_ip
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg, "execution": execution}

@app.post("/api/tasks/{execution_id}/api-check")
def api_check_task(execution_id: int, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Vérification instantanée 1-clic avec validation serveur."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    ok, msg, data = VerificationEngine.verify_execution(
        execution_id=execution_id,
        worker_id=current_user["id"],
        proof_type="api_check",
        proof_data="api_direct_pass",
        ip_address=client_ip
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg, "data": data}

@app.post("/api/tasks/{execution_id}/submit-proof")
def submit_proof_task(execution_id: int, req: TaskProofSubmitRequest, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Soumission avec capture d'écran ou jeton d'action."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    ok, msg, data = VerificationEngine.verify_execution(
        execution_id=execution_id,
        worker_id=current_user["id"],
        proof_type=req.proof_type,
        proof_data=req.proof_data or "",
        ip_address=client_ip
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg, "data": data}

@app.post("/api/tasks/{execution_id}/cancel")
def cancel_task(execution_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    ok, msg = TaskDistributionEngine.cancel_task(execution_id, current_user["id"])
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg}

@app.get("/api/tasks/my/list")
def list_my_tasks(
    status: str = "",
    scope: str = "manual",
    platform: str = "",
    page: int = 1,
    before: Optional[int] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    if scope in ("app", "premium"):
        return {
            "ok": True,
            "kind": "daily" if scope == "app" else "tasks",
            "items": [],
            "tasks": [],
            "has_more": False,
            "next": None
        }

    status_map = {"in_progress": "claimed", "approved": "verified", "pending_review": "submitted"}
    where = ["te.worker_id = ?"]
    params: List[Any] = [current_user["id"]]
    if status:
        where.append("te.status = ?")
        params.append(status_map.get(status, status))
    if platform:
        where.append("LOWER(c.platform) = LOWER(?)")
        params.append(platform)
    if before:
        where.append("te.id < ?")
        params.append(before)

    sql = f"""
        SELECT te.*, c.title, c.target_url, c.platform, c.action_type, c.description
        FROM task_executions te
        JOIN campaigns c ON te.campaign_id = c.id
        WHERE {' AND '.join(where)}
        ORDER BY te.id DESC LIMIT 25
    """
    rows = query_all(sql, tuple(params))
    rev_status = {"verified": "approved", "claimed": "in_progress", "submitted": "pending_review"}
    items = []
    for r in rows:
        st = rev_status.get(r["status"], r["status"])
        items.append({
            "id": r["id"],
            "order_id": r["campaign_id"],
            "platform": r["platform"],
            "action": r["action_type"],
            "label": r["title"],
            "target_url": r["target_url"],
            "status": st,
            "started_at": r["claimed_at"],
            "paid": r["reward_amount"] if st == "approved" else None,
        })
    return {
        "ok": True,
        "kind": "tasks",
        "items": items,
        "tasks": rows,
        "has_more": False,
        "next": items[-1]["id"] if items else None
    }

# ==============================================================================
# 4. CAMPAIGNS (ADVERTISERS)
# ==============================================================================
@app.get("/api/campaigns")
def list_campaigns(current_user: Dict[str, Any] = Depends(get_current_user)):
    campaigns = query_all("""
        SELECT * FROM campaigns WHERE advertiser_id = ? ORDER BY id DESC
    """, (current_user["id"],))
    return {"campaigns": campaigns}

@app.post("/api/campaigns")
def create_campaign(req: CampaignCreateRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    cost_per_action = round(req.reward_per_action * 1.4, 4)  # Marge plateforme de 40%
    total_budget = round(cost_per_action * req.target_quantity, 4)

    ok, camp_id, msg = WalletService.create_campaign_atomic(
        advertiser_id=current_user["id"],
        title=req.title,
        description=req.description or "",
        platform=req.platform.lower(),
        action_type=req.action_type.lower(),
        target_url=req.target_url,
        reward_per_action=req.reward_per_action,
        cost_per_action=cost_per_action,
        target_quantity=req.target_quantity,
        total_budget=total_budget,
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    return {"status": "success", "message": msg, "campaign_id": camp_id}

# ==============================================================================
# 5. REFERRAL PROGRAM
# ==============================================================================
@app.get("/api/referrals")
def get_referral_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    referrals = query_all("""
        SELECT id, username, created_at, balance FROM users WHERE referred_by = ?
    """, (current_user["id"],))

    comm_row = query_one("""
        SELECT SUM(amount) as total_comm FROM transactions 
        WHERE user_id = ? AND type = 'referral_commission'
    """, (current_user["id"],))
    total_commission = comm_row["total_comm"] or 0.0

    return {
        "referral_code": current_user["referral_code"],
        "referral_link": f"https://l-marchande.io/register?ref={current_user['referral_code']}",
        "commission_rate": "10%",
        "total_referrals": len(referrals),
        "total_commission_earned": round(total_commission, 4),
        "referrals": referrals
    }

# ==============================================================================
# 6. WALLET TRANSACTIONS (DEPOSIT INTENT / WEBHOOK / ESCROW WITHDRAW)
# ==============================================================================
@app.post("/api/wallet/deposit")
def deposit(req: DepositRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    intent_ref = f"DEP-{secrets.token_hex(6).upper()}"
    tx_id = WalletService.create_pending_deposit(
        user_id=current_user["id"],
        amount=req.amount,
        payment_method=req.payment_method,
        reference_id=intent_ref
    )
    if not tx_id:
        raise HTTPException(status_code=400, detail="Impossible de créer la demande de dépôt.")
    return {
        "status": "pending",
        "tx_id": tx_id,
        "payment_intent_id": intent_ref,
        "message": f"Intention de dépôt (${req.amount:.2f}) créée ({intent_ref}). En attente de confirmation prestataire/administrateur."
    }

@app.post("/api/wallet/webhook/deposit")
async def deposit_webhook(request: Request, x_webhook_signature: Optional[str] = Header(None)):
    webhook_secret = os.environ.get("L_MARCHANDE_WEBHOOK_SECRET", "").strip()
    if not webhook_secret:
        raise HTTPException(status_code=503, detail="Webhook de paiement non configuré.")
    raw_body = await request.body()
    expected = hmac.new(webhook_secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    if not x_webhook_signature or not hmac.compare_digest(expected, x_webhook_signature.strip()):
        raise HTTPException(status_code=403, detail="Signature webhook invalide.")
    payload = await request.json()
    tx_id = int(payload.get("tx_id", 0))
    ok, msg = WalletService.approve_pending_deposit(tx_id, provider_ref=str(payload.get("provider_ref", "")))
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

@app.post("/api/wallet/withdraw")
def withdraw(req: WithdrawalRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    ok, tx_id, msg = WalletService.request_withdrawal(
        user_id=current_user["id"],
        amount=req.amount,
        payment_method=req.payment_method,
        account_details=req.account_details
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "pending", "tx_id": tx_id, "message": msg}

# ==============================================================================
# 7. PUBLIC STATS & PLATFORM METRICS
# ==============================================================================
@app.get("/api/public/stats")
def public_stats():
    workers_cnt = query_one("SELECT COUNT(*) as cnt FROM users WHERE role = 'worker'")["cnt"]
    completed_tasks = query_one("SELECT COUNT(*) as cnt FROM task_executions WHERE status = 'verified'")["cnt"]
    paid_row = query_one("SELECT SUM(amount) as s FROM transactions WHERE type = 'task_reward'")
    total_paid = paid_row["s"] if paid_row and paid_row["s"] else 14250.80

    return {
        "platform": "L-MARCHANDE",
        "active_workers": max(workers_cnt + 2480, 2480),
        "completed_tasks": max(completed_tasks + 148500, 148500),
        "total_paid_out": round(total_paid + 85400.0, 2),
        "uptime": "99.98%"
    }

# ==============================================================================
# 8. ADMIN DASHBOARD & SENTINEL
# ==============================================================================
@app.get("/api/admin/stats")
def admin_stats(admin: Dict[str, Any] = Depends(get_admin_user)):
    users_cnt = query_one("SELECT COUNT(*) as cnt FROM users")["cnt"]
    campaigns_cnt = query_one("SELECT COUNT(*) as cnt FROM campaigns")["cnt"]
    executions_cnt = query_one("SELECT COUNT(*) as cnt FROM task_executions")["cnt"]
    fraud_cnt = query_one("SELECT COUNT(*) as cnt FROM anti_fraud_logs")["cnt"]

    return {
        "total_users": users_cnt,
        "total_campaigns": campaigns_cnt,
        "total_executions": executions_cnt,
        "fraud_alerts_triggered": fraud_cnt
    }

@app.get("/api/admin/users")
def admin_users(admin: Dict[str, Any] = Depends(get_admin_user)):
    return {"users": query_all("SELECT id, email, username, role, balance, trust_score, warning_strikes, is_banned, created_at, last_ip FROM users ORDER BY id DESC LIMIT 100")}

@app.post("/api/admin/users/{user_id}/ban")
def admin_ban_user(user_id: int, reason: str = "Non-respect des règles de conformité", admin: Dict[str, Any] = Depends(get_admin_user)):
    execute_commit("UPDATE users SET is_banned = 1, ban_reason = ? WHERE id = ?", (reason, user_id))
    return {"status": "success", "message": f"Utilisateur #{user_id} banni."}

@app.post("/api/admin/users/{user_id}/unban")
def admin_unban_user(user_id: int, admin: Dict[str, Any] = Depends(get_admin_user)):
    execute_commit("UPDATE users SET is_banned = 0, ban_reason = NULL, warning_strikes = 0 WHERE id = ?", (user_id,))
    return {"status": "success", "message": f"Utilisateur #{user_id} réactivé."}

@app.post("/api/admin/deposits/{tx_id}/approve")
def admin_approve_deposit(tx_id: int, admin: Dict[str, Any] = Depends(get_admin_user)):
    ok, msg = WalletService.approve_pending_deposit(tx_id, provider_ref=f"ADMIN:{admin['id']}")
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

@app.post("/api/admin/withdrawals/{tx_id}/approve")
def admin_approve_withdrawal(tx_id: int, admin: Dict[str, Any] = Depends(get_admin_user)):
    ok, msg = WalletService.resolve_withdrawal(tx_id, approve=True)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

@app.post("/api/admin/withdrawals/{tx_id}/reject")
def admin_reject_withdrawal(tx_id: int, reason: str = "Refusé par l'administrateur", admin: Dict[str, Any] = Depends(get_admin_user)):
    ok, msg = WalletService.resolve_withdrawal(tx_id, approve=False, reason=reason)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "message": msg}

# ==============================================================================
# 9. PR.SOCIAL COMPATIBILITY ROUTER & EXACT FRONTEND SERVING
# ==============================================================================
app.include_router(pr_router)

if os.path.exists(FRONTEND_DIR):
    for sub in ("cab", "css", "js", "i18n", "assets"):
        sub_dir = os.path.join(FRONTEND_DIR, sub)
        if os.path.isdir(sub_dir):
            app.mount(f"/{sub}", StaticFiles(directory=sub_dir), name=sub)
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

def _serve_login_view(view_name: str = "in") -> HTMLResponse:
    login_path = os.path.join(FRONTEND_DIR, "login.html")
    if os.path.exists(login_path):
        html = open(login_path, encoding="utf-8").read()
        if view_name != "in":
            html = html.replace('"view":"in"', f'"view":"{view_name}"')
        return HTMLResponse(html)
    return HTMLResponse("<h1>Login</h1>")

@app.get("/login")
def page_login():
    return _serve_login_view("in")

@app.get("/register")
def page_register():
    return _serve_login_view("up")

@app.get("/forgot-password")
@app.get("/forgot")
def page_forgot():
    return _serve_login_view("forgot")

@app.get("/live")
def page_live():
    p = os.path.join(FRONTEND_DIR, "live.html")
    if os.path.exists(p):
        return FileResponse(p)
    return _serve_login_view("in")

AUTH_PAGE_ROUTES = {
    "dashboard", "tasks", "my-tasks", "orders", "create-order",
    "wallet", "profile", "referrals", "leaderboard", "tools",
    "premium", "recovery", "autoearn", "support"
}
PUBLIC_SPA_ROUTES = {
    "faq", "rules", "privacy", "terms", "refunds", "guides",
    "verify-email", "reset-password"
}

def _get_cookie_user(request: Request) -> Optional[Dict[str, Any]]:
    token = request.cookies.get("pr_token")
    if not token:
        return None
    payload = SecurityHelper.verify_jwt(token)
    if not payload or "sub" not in payload:
        return None
    u = query_one("SELECT id, role, is_banned FROM users WHERE id = ?", (payload["sub"],))
    if not u or u["is_banned"]:
        return None
    return u

@app.get("/")
def page_root(request: Request):
    if _get_cookie_user(request):
        app_path = os.path.join(FRONTEND_DIR, "app.html")
        if os.path.exists(app_path):
            return FileResponse(app_path)
    return _serve_login_view("in")

@app.get("/{full_path:path}")
def serve_spa(full_path: str, request: Request):
    clean = full_path.strip("/")
    target = os.path.join(FRONTEND_DIR, clean)
    if clean and os.path.isfile(target):
        return FileResponse(target)

    # Routes d'administration protégées côté serveur
    if clean == "admin" or clean.startswith("admin/"):
        u = _get_cookie_user(request)
        if not u:
            return RedirectResponse(url=f"/login?next=/{clean}", status_code=302)
        if u.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Accès administrateur requis.")
        app_file = os.path.join(FRONTEND_DIR, "app.html")
        if os.path.exists(app_file):
            return FileResponse(app_file)

    # Routes applicatives protégées côté serveur
    if clean in AUTH_PAGE_ROUTES:
        if not _get_cookie_user(request):
            return RedirectResponse(url=f"/login?next=/{clean}", status_code=302)
        app_file = os.path.join(FRONTEND_DIR, "app.html")
        if os.path.exists(app_file):
            return FileResponse(app_file)

    # Routes publiques connues (guides, faq, verify-email, etc.)
    if clean in PUBLIC_SPA_ROUTES:
        app_file = os.path.join(FRONTEND_DIR, "app.html")
        if os.path.exists(app_file):
            return FileResponse(app_file)

    raise HTTPException(status_code=404, detail="Page introuvable.")
