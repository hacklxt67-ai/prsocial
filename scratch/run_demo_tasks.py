import os
import sys
import json
import time

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from pc_bot.http_action_engine import UniversalSilentEngine, PrSocialClient

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

tok = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").strip()

print("="*60)
print(" DEMONSTRATION EN DIRECT : EXECUTION REELLE DE 3-4 TACHES")
print("="*60)

client = PrSocialClient(tok, cf)
st, me = client.get_me()
init_balance = float(me.get("user", {}).get("balance", 0.0))
print(f"Utilisateur : @{me.get('user', {}).get('username')}")
print(f"Solde Initial : ${init_balance:.4f}\n")

engine = UniversalSilentEngine(pr_token=tok, cf_clearance=cf)
engine.delay_min = 4.0
engine.delay_max = 6.0

# Limiter l'exécution à 3 tâches complétées avec succès
class DemoEngine(UniversalSilentEngine):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.max_success = 3
        self.total_done = 0

    def run_all(self, platforms=None):
        logger = sys.modules['pc_bot.http_action_engine'].logger
        logger.info("=== DEMARRAGE DEMO 3 TACHES REELLES ===")
        self.auto_unblock_active_tasks()
        
        status, socials = self.pr_api.get_socials()
        approved_accounts = {}
        if status == 200:
            for acc in socials.get("accounts", []):
                if acc.get("status") == "approved":
                    approved_accounts[acc.get("platform", "").lower()] = acc

        active_list = ["youtube", "facebook", "instagram"]
        
        for plat in active_list:
            if self.total_done >= self.max_success or self.stop_requested:
                break
            
            acc_id = approved_accounts.get(plat, {}).get("id")
            st, data = self.pr_api.get_available_tasks(plat, limit=10)
            if st != 200:
                continue
                
            for t in data.get("tasks", []):
                if self.total_done >= self.max_success or self.stop_requested:
                    break
                    
                task_id = t["id"]
                action = (t.get("action") or "FOLLOW").upper()
                reward = float(t.get("worker_reward") or t.get("cost_per_task") or 0.0)
                
                feasible, _ = self.is_task_feasible(t)
                if not feasible:
                    continue
                    
                logger.info(f"\n--- [TACHE {self.total_done + 1}/{self.max_success}] #{task_id} [{plat.upper()} - {action}] ---")
                start_st, start_res = self.pr_api.start_task(task_id, acc_id)
                if start_st != 200 or not start_res.get("ok"):
                    logger.warning(f"Start error: {start_res.get('error')}")
                    self.auto_unblock_active_tasks()
                    time.sleep(1)
                    continue
                    
                target_url = start_res.get("task", {}).get("target_url") or t.get("target_url") or ""
                wait_sec = int(start_res.get("submit_after_sec") or 5)
                api_check_enabled = start_res.get("api_check_enabled", 0)
                
                logger.info(f"Navigation silencieuse vers: {target_url}...")
                act_ok, act_msg, shot_path = self.browser_bot.execute_task_action(
                    platform=plat, action=action, target_url=target_url, task_id=task_id
                )
                
                is_validated = False
                if api_check_enabled == 1:
                    chk_st, chk_res = self.pr_api.api_check_task(task_id)
                    if chk_st == 200 and chk_res.get("found") is True and chk_res.get("approved") is True:
                        is_validated = True
                        logger.info(" [✓] Valide par API instantanee!")
                
                if not is_validated and os.path.exists(shot_path):
                    logger.info(f"Attente reglementaire de {wait_sec}s puis soumission preuve...")
                    time.sleep(wait_sec)
                    sub_st, sub_res = self.pr_api.submit_screenshot_file(task_id, shot_path)
                    if sub_st == 200 and sub_res.get("ok"):
                        is_validated = True
                        status_str = sub_res.get("completion", {}).get("status", "pending_review")
                        logger.info(f" [✓] Preuve d'ecran REELLE soumise et approuvee (statut: {status_str})")
                        
                if is_validated:
                    self.total_done += 1
                    logger.info(f"🎉 SUCCES REEL: Tache #{task_id} validee ! (+${reward:.4f})")
                    
                    # Verif solde
                    time.sleep(1)
                    _, fresh = self.pr_api.get_me()
                    if fresh.get("user"):
                        logger.info(f"💰 Solde PR.Social mis a jour : ${float(fresh['user']['balance']):.4f}")
                else:
                    logger.warning(f"Echec tache #{task_id}, annulation de securite...")
                    self.pr_api.cancel_task(task_id)
                    
                time.sleep(3)

        self.browser_bot.stop_driver()

demo = DemoEngine(pr_token=tok, cf_clearance=cf)
demo.run_all()

print("\n" + "="*60)
print(f" DEMONSTRATION TERMINEE : {demo.total_done} TACHES EXECUTEES AVEC SUCCES")
_, final_me = client.get_me()
final_balance = float(final_me.get("user", {}).get("balance", 0.0))
print(f" Solde Initial : ${init_balance:.4f}")
print(f" Solde Final   : ${final_balance:.4f}")
print(f" Difference    : +${(final_balance - init_balance):.4f}")
print("="*60)
