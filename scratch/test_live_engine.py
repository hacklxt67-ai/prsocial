import sys
import os
sys.path.insert(0, os.path.abspath("."))

import json
from pc_bot.http_action_engine import UniversalSilentEngine

with open(r"D:\social_pc_bot\config.json", "r", encoding="utf-8") as f:
    cfg = json.load(f)

tok = cfg.get("token", "").replace("token=", "").strip()
cf = cfg.get("cf_clearance", "").strip()

engine = UniversalSilentEngine(pr_token=tok, cf_clearance=cf)
engine.delay_min = 1.0
engine.delay_max = 2.0

import threading
import time

def auto_stop():
    time.sleep(18)
    engine.stop_requested = True

threading.Thread(target=auto_stop, daemon=True).start()
engine.run_all(platforms=["facebook"])
