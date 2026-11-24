import os
import sys
from fastapi import FastAPI, Depends, HTTPException, Header, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
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

# Initialisation de la base de données
init_db()

app = FastAPI(
    title="L-Marchande Enterprise API",
    description="Plateforme d'engagement social & distribution de tâches haute performance",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Répertoire du frontend
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# ==============================================================================
# AUTHENTICATION DEPENDENCY
# ==============================================================================
def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Extrait et valide l'utilisateur actuel via le token JWT."""
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token d'authentification manquant.")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Format de token invalide (Attendu: Bearer <token>).")

    token = parts[1]
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
def register(req: UserRegisterRequest, request: Request):
    # Vérifier l'unicité de l'email et du pseudo
    if query_one("SELECT id FROM users WHERE email = ?", (req.email,)):
        raise HTTPException(status_code=400, detail="Cette adresse email est déjà enregistrée.")
    if query_one("SELECT id FROM users WHERE username = ?", (req.username,)):
        raise HTTPException(status_code=400, detail="Ce nom d'utilisateur est déjà utilisé.")

    # Parrainage
    referred_by_id = None
    if req.referral_code:
        sponsor = query_one("SELECT id FROM users WHERE referral_code = ?", (req.referral_code.strip().upper(),))
        if sponsor:
            referred_by_id = sponsor["id"]

    client_ip = request.client.host if request.client else "127.0.0.1"
    hashed_pwd = SecurityHelper.hash_password(req.password)
    new_ref_code = SecurityHelper.generate_referral_code("LM")

    user_id = execute_commit("""
        INSERT INTO users (email, username, hashed_password, role, referral_code, referred_by, last_ip)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (req.email, req.username, hashed_pwd, req.role or "worker", new_ref_code, referred_by_id, client_ip))

    user = query_one("SELECT * FROM users WHERE id = ?", (user_id,))
    token = SecurityHelper.create_jwt({"sub": user_id, "username": user["username"], "role": user["role"]})

    # Nettoyage mot de passe avant retour
    user_data = dict(user)
    user_data.pop("hashed_password", None)

    return {"access_token": token, "token_type": "bearer", "user": user_data}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(req: UserLoginRequest, request: Request):
    user = query_one("""
        SELECT * FROM users WHERE username = ? OR email = ?
    """, (req.username_or_email, req.username_or_email))

    if not user or not SecurityHelper.verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Identifiants incorrects.")

    if user["is_banned"]:
        raise HTTPException(status_code=403, detail=f"Compte suspendu : {user.get('ban_reason') or 'Fraude détectée'}")

    client_ip = request.client.host if request.client else "127.0.0.1"
    execute_commit("UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_ip = ? WHERE id = ?", (client_ip, user["id"]))

    token = SecurityHelper.create_jwt({"sub": user["id"], "username": user["username"], "role": user["role"]})
    user_data = dict(user)
    user_data.pop("hashed_password", None)

    return {"access_token": token, "token_type": "bearer", "user": user_data}

@app.get("/api/auth/me")
def me(current_user: Dict[str, Any] = Depends(get_current_user)):
    user_data = dict(current_user)
    user_data.pop("hashed_password", None)
    return {"user": user_data}

# ==============================================================================
# 2. PROFILE & SOCIAL ACCOUNTS
# ==============================================================================
@app.get("/api/profile/socials")
def list_social_accounts(current_user: Dict[str, Any] = Depends(get_current_user)):
    accounts = query_all("SELECT * FROM social_accounts WHERE user_id = ?", (current_user["id"],))
    return {"accounts": accounts}

@app.post("/api/profile/socials")
def add_social_account(req: SocialAccountCreate, current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        acc_id = execute_commit("""
            INSERT INTO social_accounts (user_id, platform, account_identifier, account_url, status)
            VALUES (?, ?, ?, ?, 'verified')
        """, (current_user["id"], req.platform.lower(), req.account_identifier.strip(), req.account_url))
        return {"status": "success", "message": "Compte social associé avec succès !", "account_id": acc_id}
    except Exception:
        raise HTTPException(status_code=400, detail="Ce compte est déjà associé à votre profil.")

@app.delete("/api/profile/socials/{account_id}")
def delete_social_account(account_id: int, current_user: Dict[str, Any] = Depends(get_current_user)):
    execute_commit("DELETE FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, current_user["id"]))
    return {"status": "success", "message": "Compte supprimé."}

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
def list_my_tasks(status: str = "in_progress", current_user: Dict[str, Any] = Depends(get_current_user)):
    db_status = "claimed" if status == "in_progress" else status
    tasks = query_all("""
        SELECT te.*, c.title, c.target_url, c.platform, c.action_type, c.description
        FROM task_executions te
        JOIN campaigns c ON te.campaign_id = c.id
        WHERE te.worker_id = ? AND te.status = ?
        ORDER BY te.id DESC
    """, (current_user["id"], db_status))
    return {"tasks": tasks}

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

    # Débiter le solde de l'annonceur
    if not WalletService.debit_user(
        user_id=current_user["id"],
        amount=total_budget,
        tx_type="campaign_funding",
        description=f"Financement Campagne : {req.title} ({req.target_quantity} actions)",
        reference_id=req.platform
    ):
        raise HTTPException(status_code=400, detail=f"Solde insuffisant. Budget requis : ${total_budget:.4f}")

    camp_id = execute_commit("""
        INSERT INTO campaigns (advertiser_id, title, description, platform, action_type, target_url, reward_per_action, cost_per_action, target_quantity, total_budget, remaining_budget, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    """, (current_user["id"], req.title, req.description, req.platform.lower(), req.action_type.lower(), req.target_url, req.reward_per_action, cost_per_action, req.target_quantity, total_budget, total_budget))

    return {"status": "success", "message": "Campagne créée et déployée avec succès !", "campaign_id": camp_id}

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
# 6. WALLET TRANSACTIONS (DEPOSIT / WITHDRAW)
# ==============================================================================
@app.post("/api/wallet/deposit")
def deposit(req: DepositRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    WalletService.credit_user(
        user_id=current_user["id"],
        amount=req.amount,
        tx_type="deposit",
        description=f"Dépôt via {req.payment_method.upper()}",
        reference_id="SIMULATED_GATEWAY_TX"
    )
    return {"status": "success", "message": f"${req.amount:.2f} crédités avec succès sur votre compte !"}

@app.post("/api/wallet/withdraw")
def withdraw(req: WithdrawalRequest, current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user["balance"] < req.amount:
        raise HTTPException(status_code=400, detail="Solde insuffisant pour ce montant.")

    if not WalletService.debit_user(
        user_id=current_user["id"],
        amount=req.amount,
        tx_type="withdrawal",
        description=f"Demande de Retrait ({req.payment_method}) -> {req.account_details}",
        reference_id="PENDING_PAYOUT"
    ):
        raise HTTPException(status_code=400, detail="Erreur lors du traitement du retrait.")

    return {"status": "success", "message": "Votre demande de retrait a été enregistrée et sera traitée sous 2h."}

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

# ==============================================================================
# 9. FRONTEND STATIC ASSETS
# ==============================================================================
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    target = os.path.join(FRONTEND_DIR, full_path)
    if full_path and os.path.isfile(target):
        return FileResponse(target)
    # SPA Fallback sur index.html
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse({"status": "L-MARCHANDE Core API Online", "version": "1.0.0"})
