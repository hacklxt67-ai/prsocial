from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Header, Request, Response, Query, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
from database import query_one, query_all, execute_commit
from security import SecurityHelper
from services.wallet_service import WalletService
from services.task_engine import TaskDistributionEngine
from services.verification_engine import VerificationEngine
from services.social_verification import (
    clean_username, build_profile_url, generate_verify_code,
    fetch_live_bio, validate_and_save_screenshot
)
from services.email_service import (
    issue_verification_email, verify_email_token,
    initiate_email_change, confirm_email_change
)

router = APIRouter()

def _iso_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

def _get_optional_user(request: Request, authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    token = None
    if authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
    if not token:
        token = request.cookies.get("pr_token")
    if not token:
        return None
    payload = SecurityHelper.verify_jwt(token)
    if not payload or "sub" not in payload:
        return None
    user = query_one("SELECT * FROM users WHERE id = ?", (payload["sub"],))
    if not user or user["is_banned"]:
        return None
    u = dict(user)
    u.pop("hashed_password", None)
    return u

def _require_user(request: Request, authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    u = _get_optional_user(request, authorization)
    if not u:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return u

# ==============================================================================
# 1. CABINET & DOOR (PR.SOCIAL /cab/ ENGINE)
# ==============================================================================
@router.get("/api/cabinet/frame")
def cabinet_frame(request: Request, authorization: Optional[str] = Header(None)):
    user = _get_optional_user(request, authorization)
    counts = {}
    if user:
        avail = query_one("SELECT COUNT(*) as c FROM campaigns WHERE status='active' AND remaining_budget > 0")
        my_active = query_one("SELECT COUNT(*) as c FROM task_executions WHERE worker_id=? AND status='claimed'", (user["id"],))
        counts = {
            "tasks": avail["c"] if avail else 0,
            "my_tasks": my_active["c"] if my_active else 0,
            "unread_tickets": 0,
            "warnings": user.get("warning_strikes", 0)
        }
    return {
        "ok": True,
        "guest": user is None,
        "user": user,
        "counts": counts,
        "lang": {"saved": request.cookies.get("pr_lang") or "fr", "origin": "old", "card": []},
        "flags": {},
        "now": _iso_now(),
        "v": "1241c4884eb6"
    }

@router.post("/api/cabinet/lang")
async def cabinet_lang(request: Request, response: Response):
    body = {}
    try:
        body = await request.json()
    except Exception:
        pass
    lang = body.get("lang", "fr")
    response.set_cookie("pr_lang", lang, max_age=86400*365, path="/", samesite="lax")
    return {"ok": True, "lang": lang}

@router.get("/api/cabinet/door")
def cabinet_door():
    workers_cnt = query_one("SELECT COUNT(*) as cnt FROM users WHERE role='worker'")["cnt"]
    completed_cnt = query_one("SELECT COUNT(*) as cnt FROM task_executions WHERE status='verified'")["cnt"]
    return {
        "ok": True,
        "now": _iso_now(),
        "stats": {
            "people": 360865 + workers_cnt,
            "tasks": 549296938 + completed_cnt,
            "paid": 295294,
            "live": {"count": 22057, "spark": [1134, 1146, 785, 657, 540, 467]}
        },
        "captcha": None,
        "unchecked": {"signin": True, "known": False, "letter": True},
        "code": {"ttl_min": 10, "trust_days": 30}
    }

@router.get("/api/cabinet/live")
def cabinet_live(h: Optional[str] = None):
    recent = query_all("""
        SELECT te.id, te.reward_amount, te.verified_at, c.platform, c.action_type, u.username
        FROM task_executions te
        JOIN campaigns c ON te.campaign_id = c.id
        JOIN users u ON te.worker_id = u.id
        ORDER BY te.id DESC LIMIT 20
    """)
    return {
        "ok": True,
        "now": _iso_now(),
        "stats": {
            "people": 360865,
            "tasks": 549296938,
            "paid": 295294,
            "online": 1842,
            "live": {"count": 22057, "spark": [1134, 1146, 785, 657, 540, 467]}
        },
        "feed": recent
    }

@router.get("/api/cabinet/docs")
def cabinet_docs():
    return {"ok": True, "docs": []}

@router.post("/api/cabinet/oops")
async def cabinet_oops():
    return {"ok": True}

# ==============================================================================
# 2. AUTH EXTRAS & COMPATIBILITY
# ==============================================================================
@router.post("/api/auth/logout")
def auth_logout(response: Response):
    response.delete_cookie("pr_token", path="/")
    return {"ok": True}

@router.post("/api/auth/robot-report")
async def robot_report():
    return {"ok": True}

@router.get("/api/auth/invite-code")
def invite_code(code: str = ""):
    sponsor = query_one("SELECT id, username FROM users WHERE referral_code = ?", (code.strip().upper(),))
    if sponsor:
        return {"ok": True, "valid": True, "kind": "ref", "bonus": 0}
    return {"ok": True, "valid": False, "kind": "none", "bonus": 0}

@router.post("/api/auth/forgot-password")
async def forgot_password():
    return {"ok": True, "message": "Password reset link sent if account exists."}

@router.post("/api/auth/reset-password")
async def reset_password():
    return {"ok": True}

@router.post("/api/auth/resend-verification")
async def resend_verification(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    ok, msg, _ = issue_verification_email(user["id"], user["email"], base_url=str(request.base_url), enforce_cooldown=True)
    if not ok:
        status_code = 429 if "patienter" in msg.lower() else 400
        return JSONResponse({"ok": False, "error": msg}, status_code=status_code)
    return {"ok": True, "message": msg}

@router.get("/api/auth/verify-email")
def verify_email(token: str = ""):
    ok, msg = verify_email_token(token)
    if not ok:
        return JSONResponse({"ok": False, "verified": False, "error": msg}, status_code=400)
    return {"ok": True, "verified": True, "message": msg}

@router.post("/api/profile/email")
async def profile_change_email(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = await request.json()
    ok, payload = initiate_email_change(user["id"], body.get("new_email", ""), body.get("password", ""))
    if not ok:
        return JSONResponse(payload, status_code=400)
    return payload

@router.post("/api/profile/email/confirm")
async def profile_confirm_email(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = await request.json()
    ok, msg = confirm_email_change(user["id"], body.get("code", ""))
    if not ok:
        return JSONResponse({"ok": False, "error": msg}, status_code=400)
    return {"ok": True, "message": msg}

@router.post("/api/auth/verify-2fa")
async def verify_2fa():
    return {"ok": False, "error": "2FA not enabled"}

@router.post("/api/auth/2fa/send")
async def send_2fa():
    return {"ok": True, "retry_in": 60}

@router.get("/api/version")
def api_version():
    return {"ok": True, "version": "1241c4884eb6"}

@router.post("/api/public/news/{news_id}/react")
async def react_news(news_id: int):
    return {"ok": True}

# ==============================================================================
# 3. TASKS & EXECUTIONS COMPATIBILITY
# ==============================================================================
@router.get("/api/tasks/available")
def tasks_available(
    platform: Optional[str] = "all",
    sort: str = "reward",
    limit: int = 50,
    page: int = 1,
    user: Dict[str, Any] = Depends(_require_user)
):
    res = TaskDistributionEngine.get_available_tasks(
        worker_id=user["id"], platform=platform, sort=sort, limit=limit, page=page
    )
    enriched = []
    for t in res.get("tasks", []):
        item = dict(t)
        item.setdefault("reward", item.get("reward_per_action", 0.005))
        item.setdefault("action", item.get("action_type", "like"))
        item.setdefault("label", item.get("title", ""))
        item.setdefault("remaining", max(1, (item.get("target_quantity", 100) - item.get("completed_quantity", 0))))
        item.setdefault("total_count", item.get("target_quantity", 100))
        item.setdefault("completed_count", item.get("completed_quantity", 0))
        enriched.append(item)
    res["tasks"] = enriched
    res["ok"] = True
    res["has_more"] = False
    return res

@router.get("/api/tasks/api-check-enabled")
def api_check_enabled():
    return {
        "ok": True,
        "enabled": True,
        "platforms": ["instagram", "telegram", "youtube", "tiktok", "twitter", "website", "vk", "threads", "reddit", "snapchat"]
    }

@router.get("/api/tasks/dashboard-init")
def dashboard_init(user: Dict[str, Any] = Depends(_require_user)):
    avail = TaskDistributionEngine.get_available_tasks(worker_id=user["id"], limit=50)
    completed = query_one("SELECT COUNT(*) as c, COALESCE(SUM(reward_amount),0) as s FROM task_executions WHERE worker_id=? AND status='verified'", (user["id"],))
    pending = query_one("SELECT COUNT(*) as c FROM task_executions WHERE worker_id=? AND status='claimed'", (user["id"],))
    recent = query_all("""
        SELECT te.id, te.status, te.reward_amount as reward, te.claimed_at as created_at, c.platform, c.action_type as action, c.title as label
        FROM task_executions te
        JOIN campaigns c ON te.campaign_id = c.id
        WHERE te.worker_id = ?
        ORDER BY te.id DESC LIMIT 4
    """, (user["id"],))
    pcounts = {}
    for t in avail.get("tasks", []):
        plat = t.get("platform", "other")
        pcounts[plat] = pcounts.get(plat, 0) + 1
    platform_counts = [{"platform": k, "count": v} for k, v in pcounts.items()]
    return {
        "ok": True,
        "user": user,
        "status_counts": {
            "approved": completed["c"],
            "pending_review": pending["c"],
        },
        "total_earned": round(completed["s"], 4),
        "recent_tasks": recent,
        "platform_counts": platform_counts,
        "chart": [],
        "news": []
    }

@router.get("/api/tasks/my/history")
def my_tasks_history(user: Dict[str, Any] = Depends(_require_user)):
    rows = query_all("""
        SELECT te.*, c.title, c.target_url, c.platform, c.action_type
        FROM task_executions te
        JOIN campaigns c ON te.campaign_id = c.id
        WHERE te.worker_id = ? ORDER BY te.id DESC LIMIT 100
    """, (user["id"],))
    return {"ok": True, "tasks": rows, "history": rows}

@router.get("/api/tasks/my/summary")
def my_tasks_summary(user: Dict[str, Any] = Depends(_require_user)):
    c_pend = query_one("SELECT COUNT(*) as c FROM task_executions WHERE worker_id=? AND status='claimed'", (user["id"],))["c"]
    c_ver = query_one("SELECT COUNT(*) as c, COALESCE(SUM(reward_amount),0) as s FROM task_executions WHERE worker_id=? AND status='verified'", (user["id"],))
    c_rej = query_one("SELECT COUNT(*) as c FROM task_executions WHERE worker_id=? AND status='rejected'", (user["id"],))["c"]
    return {
        "ok": True,
        "pending": c_pend,
        "in_progress": c_pend,
        "completed": c_ver["c"],
        "verified": c_ver["c"],
        "rejected": c_rej,
        "total_earned": round(c_ver["s"], 4)
    }

@router.get("/api/tasks/my/rates")
def my_tasks_rates(user: Dict[str, Any] = Depends(_require_user)):
    return {"ok": True, "approval_rate": 100.0, "trust_score": user.get("trust_score", 100)}

@router.get("/api/tasks/leaderboard")
def tasks_leaderboard():
    top = query_all("SELECT username, balance, trust_score FROM users ORDER BY balance DESC LIMIT 25")
    return {"ok": True, "leaderboard": top}

@router.post("/api/tasks/{execution_id}/submit")
async def submit_task_alias(execution_id: int, request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = {}
    try:
        body = await request.json()
    except Exception:
        pass
    client_ip = request.client.host if request.client else "127.0.0.1"
    ok, msg, data = VerificationEngine.verify_execution(
        execution_id=execution_id,
        worker_id=user["id"],
        proof_type=body.get("proof_type", "api_check"),
        proof_data=body.get("proof_data", "submitted"),
        ip_address=client_ip
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"ok": True, "status": "success", "message": msg, "data": data}

@router.post("/api/tasks/{task_id}/report-task")
async def report_task(task_id: int, user: Dict[str, Any] = Depends(_require_user)):
    return {"ok": True, "message": "Task reported"}

# ==============================================================================
# 4. ORDERS (ADVERTISER)
# ==============================================================================
@router.get("/api/tasks/advertiser-catalog")
def advertiser_catalog():
    return {
        "ok": True,
        "catalog": [
            {"platform": "instagram", "actions": ["follow", "like", "comment", "story_view"], "min_price": 0.004},
            {"platform": "telegram", "actions": ["join", "view", "reaction"], "min_price": 0.003},
            {"platform": "youtube", "actions": ["subscribe", "like", "view"], "min_price": 0.005},
            {"platform": "tiktok", "actions": ["follow", "like", "view"], "min_price": 0.004},
            {"platform": "twitter", "actions": ["follow", "like", "retweet"], "min_price": 0.004},
            {"platform": "website", "actions": ["visit", "surf"], "min_price": 0.002}
        ]
    }

@router.get("/api/tasks/orders/my")
def orders_my(user: Dict[str, Any] = Depends(_require_user)):
    rows = query_all("SELECT * FROM campaigns WHERE advertiser_id = ? ORDER BY id DESC", (user["id"],))
    return {"ok": True, "orders": rows}

@router.get("/api/tasks/orders/stats")
def orders_stats(user: Dict[str, Any] = Depends(_require_user)):
    rows = query_all("SELECT COUNT(*) as c, COALESCE(SUM(total_budget),0) as spent FROM campaigns WHERE advertiser_id = ?", (user["id"],))
    return {"ok": True, "total_orders": rows[0]["c"], "total_spent": round(rows[0]["spent"], 4)}

@router.post("/api/tasks/orders")
async def create_order_alias(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = await request.json()
    title = body.get("title") or f"{body.get('platform','social')} {body.get('action_type','action')}"
    platform = str(body.get("platform", "instagram")).lower()
    action_type = str(body.get("action_type", "like")).lower()
    target_url = body.get("target_url", "https://pr.social")
    reward = float(body.get("reward_per_action", 0.005))
    qty = int(body.get("target_quantity", 10))
    cost = round(reward * 1.4, 4)
    total_budget = round(cost * qty, 4)
    if not WalletService.debit_user(user["id"], total_budget, "campaign_funding", f"Order: {title}", platform):
        raise HTTPException(status_code=400, detail="Insufficient balance")
    cid = execute_commit("""
        INSERT INTO campaigns (advertiser_id, title, description, platform, action_type, target_url, reward_per_action, cost_per_action, target_quantity, total_budget, remaining_budget, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    """, (user["id"], title, body.get("description", ""), platform, action_type, target_url, reward, cost, qty, total_budget, total_budget))
    return {"ok": True, "order_id": cid}

@router.post("/api/tasks/orders/{order_id}/cancel")
def cancel_order(order_id: int, user: Dict[str, Any] = Depends(_require_user)):
    execute_commit("UPDATE campaigns SET status='cancelled' WHERE id=? AND advertiser_id=?", (order_id, user["id"]))
    return {"ok": True}

@router.get("/api/tasks/orders/{order_id}/report")
def order_report(order_id: int, user: Dict[str, Any] = Depends(_require_user)):
    rows = query_all("SELECT * FROM task_executions WHERE campaign_id = ?", (order_id,))
    return {"ok": True, "executions": rows}

# ==============================================================================
# 5. PROFILE, WALLET, PREMIUM, RECOVERY, AUTOEARN, SUPPORT, TOOLS
# ==============================================================================
@router.get("/api/profile/stats")
def profile_stats(user: Dict[str, Any] = Depends(_require_user)):
    c = query_one("SELECT COUNT(*) as cnt, COALESCE(SUM(reward_amount),0) as s FROM task_executions WHERE worker_id=? AND status='verified'", (user["id"],))
    return {"ok": True, "completed": c["cnt"], "earned": round(c["s"], 4), "trust_score": user["trust_score"]}

@router.get("/api/profile/achievements")
def profile_achievements(user: Dict[str, Any] = Depends(_require_user)):
    return {"ok": True, "achievements": []}

@router.get("/api/profile/referrals")
def profile_referrals(user: Dict[str, Any] = Depends(_require_user)):
    refs = query_all("SELECT id, username, created_at, balance FROM users WHERE referred_by = ?", (user["id"],))
    return {"ok": True, "referral_code": user["referral_code"], "referrals": refs, "total": len(refs), "earned": 0}

@router.get("/api/profile/transactions")
def profile_transactions(user: Dict[str, Any] = Depends(_require_user)):
    txs = query_all("SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC LIMIT 100", (user["id"],))
    return {"ok": True, "transactions": txs}

@router.get("/api/profile/worker-card")
def profile_worker_card(user: Dict[str, Any] = Depends(_require_user)):
    return {"ok": True, "username": user["username"], "trust_score": user["trust_score"], "tier": "Standard"}

@router.get("/api/profile/app/devices")
def profile_devices():
    return {"ok": True, "devices": []}

@router.get("/api/profile/worker/my-keys")
def profile_my_keys():
    return {"ok": True, "keys": []}

@router.post("/api/profile/lang")
async def profile_lang(request: Request, response: Response):
    body = await request.json()
    lang = body.get("lang", "fr")
    response.set_cookie("pr_lang", lang, max_age=86400*365, path="/", samesite="lax")
    return {"ok": True, "lang": lang}

def _format_social_row(row: Dict[str, Any]) -> Dict[str, Any]:
    r = dict(row)
    st = r.get("status", "pending")
    r["status"] = "approved" if st in ("verified", "approved") else st
    r["username"] = r.get("account_identifier", "")
    r["profile_url"] = r.get("account_url") or build_profile_url(r.get("platform", ""), r["username"])
    r["verify_code"] = r.get("verification_token") if not str(r.get("verification_token") or "").startswith("SHA:") else None
    r["is_default"] = bool(r.get("is_default", 0))
    r["ai_attempts"] = int(r.get("ai_attempts") or 0)
    r["manual_review"] = r["ai_attempts"] >= 3
    return r

@router.get("/api/profile/socials")
def list_socials(user: Dict[str, Any] = Depends(_require_user)):
    rows = query_all("SELECT * FROM social_accounts WHERE user_id = ? ORDER BY is_default DESC, id DESC", (user["id"],))
    accounts = [_format_social_row(r) for r in rows]
    return {"ok": True, "accounts": accounts, "platforms": []}

@router.post("/api/profile/socials")
async def create_social(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = await request.json()
    platform = str(body.get("platform", "")).strip().lower()
    raw_user = body.get("username") or body.get("account_identifier") or ""
    username = clean_username(raw_user, platform)
    if not platform or not username:
        return JSONResponse({"ok": False, "error": "Plateforme et nom d'utilisateur requis."}, status_code=400)

    # Anti-multi-account check
    taken = query_one(
        "SELECT id, user_id FROM social_accounts WHERE platform = ? AND LOWER(account_identifier) = LOWER(?) AND user_id != ? AND status IN ('verified','approved')",
        (platform, username, user["id"])
    )
    if taken:
        return JSONResponse({"ok": False, "error": "Ce compte social est déjà lié à un autre utilisateur."}, status_code=400)

    profile_url = body.get("profile_url") or body.get("account_url") or build_profile_url(platform, username)
    code = generate_verify_code()
    existing = query_one(
        "SELECT id, status FROM social_accounts WHERE user_id = ? AND platform = ? AND LOWER(account_identifier) = LOWER(?)",
        (user["id"], platform, username)
    )
    if existing:
        acc_id = existing["id"]
        execute_commit(
            "UPDATE social_accounts SET account_url = ?, verification_token = COALESCE(verification_token, ?) WHERE id = ?",
            (profile_url, code, acc_id)
        )
    else:
        acc_id = execute_commit("""
            INSERT INTO social_accounts (user_id, platform, account_identifier, account_url, status, verification_token)
            VALUES (?, ?, ?, ?, 'pending', ?)
        """, (user["id"], platform, username, profile_url, code))

    return {"ok": True, "account_id": acc_id, "code": code, "message": "Compte enregistré. Veuillez procéder à la vérification."}

@router.delete("/api/profile/socials/cancel-verify")
@router.post("/api/profile/socials/cancel-verify")
async def socials_cancel_verify(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = {}
    try:
        body = await request.json()
    except Exception:
        pass
    acc_id = body.get("account_id")
    plat = body.get("platform")
    if acc_id:
        execute_commit("DELETE FROM social_accounts WHERE id = ? AND user_id = ? AND status = 'pending'", (acc_id, user["id"]))
    elif plat:
        execute_commit("DELETE FROM social_accounts WHERE platform = ? AND user_id = ? AND status = 'pending'", (plat.lower(), user["id"]))
    return {"ok": True}

@router.delete("/api/profile/socials/{account_id}")
def delete_social(account_id: int, user: Dict[str, Any] = Depends(_require_user)):
    execute_commit("DELETE FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, user["id"]))
    return {"ok": True, "message": "Compte supprimé."}

@router.post("/api/profile/socials/start-verify")
async def socials_start_verify(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = await request.json()
    platform = str(body.get("platform", "")).strip().lower()
    raw_user = body.get("username") or ""
    username = clean_username(raw_user, platform)
    if not platform or not username:
        return JSONResponse({"ok": False, "error": "Veuillez entrer un nom d'utilisateur valide."}, status_code=400)

    # Anti-multi-account check
    taken = query_one(
        "SELECT id FROM social_accounts WHERE platform = ? AND LOWER(account_identifier) = LOWER(?) AND user_id != ? AND status IN ('verified','approved')",
        (platform, username, user["id"])
    )
    if taken:
        return JSONResponse({"ok": False, "error": "Ce compte est déjà vérifié sur un autre profil."}, status_code=400)

    existing = query_one(
        "SELECT * FROM social_accounts WHERE user_id = ? AND platform = ? AND LOWER(account_identifier) = LOWER(?)",
        (user["id"], platform, username)
    )
    if existing and existing.get("status") in ("verified", "approved"):
        return {"ok": True, "already_verified": True, "account_id": existing["id"], "message": "Compte déjà vérifié !"}

    code = generate_verify_code()
    profile_url = build_profile_url(platform, username)
    if existing:
        acc_id = existing["id"]
        execute_commit(
            "UPDATE social_accounts SET verification_token = ?, status = 'pending', account_url = ? WHERE id = ?",
            (code, profile_url, acc_id)
        )
    else:
        acc_id = execute_commit("""
            INSERT INTO social_accounts (user_id, platform, account_identifier, account_url, status, verification_token)
            VALUES (?, ?, ?, ?, 'pending', ?)
        """, (user["id"], platform, username, profile_url, code))

    return {
        "ok": True,
        "code": code,
        "account_id": acc_id,
        "username": username,
        "platform": platform,
        "profile_url": profile_url
    }

@router.post("/api/profile/socials/bio-verify")
@router.post("/api/profile/socials/confirm-verify")
async def socials_bio_verify(request: Request, user: Dict[str, Any] = Depends(_require_user)):
    body = await request.json()
    platform = str(body.get("platform", "")).strip().lower()
    account_id = body.get("account_id")
    username = clean_username(body.get("username", ""), platform)

    if account_id:
        acc = query_one("SELECT * FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, user["id"]))
    else:
        acc = query_one(
            "SELECT * FROM social_accounts WHERE user_id = ? AND platform = ? AND LOWER(account_identifier) = LOWER(?)",
            (user["id"], platform, username)
        )

    if not acc:
        return JSONResponse({"ok": False, "error": "Aucune demande de vérification trouvée. Lancez d'abord la vérification."}, status_code=404)

    code = acc.get("verification_token")
    if not code or str(code).startswith("SHA:"):
        return JSONResponse({"ok": False, "error": "Code de vérification expiré ou manquant."}, status_code=400)

    status_res, msg = fetch_live_bio(acc["platform"], acc["account_identifier"], code)
    if status_res == "found":
        execute_commit(
            "UPDATE social_accounts SET status = 'approved', last_checked_at = CURRENT_TIMESTAMP WHERE id = ?",
            (acc["id"],)
        )
        return {"ok": True, "verified": True, "message": msg}

    if status_res == "blocked":
        execute_commit("UPDATE social_accounts SET ai_attempts = COALESCE(ai_attempts, 0) + 1 WHERE id = ?", (acc["id"],))
        return JSONResponse({"ok": False, "error": msg, "blocked": True}, status_code=400)

    return JSONResponse({"ok": False, "error": msg}, status_code=400)

@router.post("/api/profile/socials/verify-screenshot")
async def socials_verify_screenshot(
    request: Request,
    platform: str = Form(""),
    username: str = Form(""),
    account_id: Optional[int] = Form(None),
    user: Dict[str, Any] = Depends(_require_user)
):
    form = await request.form()
    upload = form.get("screenshot") or form.get("file") or form.get("image")
    if not upload or not hasattr(upload, "read"):
        return JSONResponse({"ok": False, "error": "Veuillez joindre une capture d'écran valide."}, status_code=400)

    raw_bytes = await upload.read()
    clean_u = clean_username(username, platform)
    ok, res_or_err = validate_and_save_screenshot(user["id"], platform.lower(), clean_u, raw_bytes)
    if not ok:
        return JSONResponse({"ok": False, "error": res_or_err}, status_code=400)

    if account_id:
        acc = query_one("SELECT * FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, user["id"]))
    else:
        acc = query_one(
            "SELECT * FROM social_accounts WHERE user_id = ? AND platform = ? AND LOWER(account_identifier) = LOWER(?)",
            (user["id"], platform.lower(), clean_u)
        )

    if acc:
        execute_commit(
            "UPDATE social_accounts SET status = 'approved', verification_token = ?, last_checked_at = CURRENT_TIMESTAMP WHERE id = ?",
            (res_or_err, acc["id"])
        )
    else:
        execute_commit("""
            INSERT INTO social_accounts (user_id, platform, account_identifier, account_url, status, verification_token)
            VALUES (?, ?, ?, ?, 'approved', ?)
        """, (user["id"], platform.lower(), clean_u, build_profile_url(platform.lower(), clean_u), res_or_err))

    return {"ok": True, "verified": True, "message": f"Capture vérifiée et compte @{clean_u} approuvé !"}

@router.post("/api/profile/socials/{account_id}/set-default")
def socials_set_default(account_id: int, user: Dict[str, Any] = Depends(_require_user)):
    acc = query_one("SELECT * FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, user["id"]))
    if not acc:
        return JSONResponse({"ok": False, "error": "Compte introuvable."}, status_code=404)
    execute_commit("UPDATE social_accounts SET is_default = 0 WHERE user_id = ? AND platform = ?", (user["id"], acc["platform"]))
    execute_commit("UPDATE social_accounts SET is_default = 1 WHERE id = ?", (account_id,))
    return {"ok": True}

@router.post("/api/profile/socials/{account_id}/unlink")
@router.post("/api/profile/socials/{account_id}/self-unlink")
def socials_unlink(account_id: int, user: Dict[str, Any] = Depends(_require_user)):
    execute_commit("DELETE FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, user["id"]))
    return {"ok": True, "message": "Compte délié avec succès."}

@router.post("/api/profile/socials/{account_id}/change-request")
@router.post("/api/profile/socials/change-request")
async def socials_change_request(request: Request, account_id: Optional[int] = None, user: Dict[str, Any] = Depends(_require_user)):
    body = {}
    try:
        body = await request.json()
    except Exception:
        pass
    if account_id:
        execute_commit("DELETE FROM social_accounts WHERE id = ? AND user_id = ?", (account_id, user["id"]))
    elif body.get("platform"):
        execute_commit("DELETE FROM social_accounts WHERE platform = ? AND user_id = ?", (str(body["platform"]).lower(), user["id"]))
    return {"ok": True, "message": "Compte libéré, vous pouvez en associer un nouveau."}

@router.post("/api/profile/socials/telegram-link-code")
async def tg_link_code(user: Dict[str, Any] = Depends(_require_user)):
    code = generate_verify_code()
    return {"ok": True, "code": code, "bot_url": f"https://t.me/prsocial_bot?start={code}"}

@router.get("/api/wallet/withdraw-info")
def withdraw_info(user: Dict[str, Any] = Depends(_require_user)):
    return {
        "ok": True,
        "balance": user["balance"],
        "min_withdraw": 0.5,
        "methods": [
            {"id": "crypto_usdt", "name": "USDT (TRC20/BEP20)", "min": 1.0, "fee": 0},
            {"id": "payeer", "name": "Payeer", "min": 0.5, "fee": 0},
            {"id": "mobile_money", "name": "Mobile Money", "min": 1.0, "fee": 0}
        ]
    }

@router.get("/api/wallet/withdrawals")
def wallet_withdrawals(user: Dict[str, Any] = Depends(_require_user)):
    rows = query_all("SELECT * FROM transactions WHERE user_id=? AND type='withdrawal' ORDER BY id DESC", (user["id"],))
    return {"ok": True, "withdrawals": rows}

@router.get("/api/premium/counter")
def premium_counter():
    return {"ok": True, "count": 0}

@router.get("/api/premium/visibility")
def premium_visibility():
    return {"ok": True, "visible": True}

@router.get("/api/premium/list")
def premium_list():
    return {"ok": True, "tasks": []}

@router.get("/api/premium/history")
def premium_history():
    return {"ok": True, "history": []}

@router.get("/api/premium/trusted-status")
def premium_trusted():
    return {"ok": True, "trusted": True}

@router.get("/api/recovery")
def recovery_list():
    return {"ok": True, "tasks": []}

@router.get("/api/recovery/visibility")
def recovery_visibility():
    return {"ok": True, "visible": False}

@router.get("/api/autoearn/status")
def autoearn_status():
    return {"ok": True, "enabled": True, "accounts": []}

@router.get("/api/autoearn/accounts/")
def autoearn_accounts():
    return {"ok": True, "accounts": []}

@router.get("/api/support/tickets")
def support_tickets():
    return {"ok": True, "tickets": []}

@router.post("/api/support/tickets")
async def create_ticket():
    return {"ok": True, "ticket_id": 1}

@router.get("/api/support/unread-count")
def support_unread():
    return {"ok": True, "count": 0}

@router.get("/api/tools/app-info")
def tools_app_info():
    return {"ok": True, "version": "3.2", "apk_url": "/tools"}

@router.get("/api/developer-redirect")
def dev_redirect():
    return {"ok": True, "url": "/profile"}
