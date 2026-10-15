import sys
sys.path.insert(0, 'termux_bot')
from termux_action_engine import TermuxBotApp
from datetime import datetime

app = TermuxBotApp()
app.print_logo()
app.verify_login()
now_str = datetime.now().strftime("%d/%m/%Y - %H:%M:%S")

print("\n╭─────────────────────────────────────────────────────────────╮")
print(f"│  👤 Utilisateur connecté : @{app.current_user:<31} │")
bal_str = f"${app.current_balance:.4f}"
print(f"│  💰 Solde actuel         : {bal_str:<32} │")
print(f"│  🕒 Date et Heure        : {now_str:<32} │")
print("╰─────────────────────────────────────────────────────────────╯")

print("\n┌─────────────────────────────────────────────────────────────┐")
print("│  [1] 🚀 Start Tout (Auto-Bot + Déblocage Auto Tâches)       │")
print("│  [2] 🔗 Comptes Liés                                        │")
print("│  [3] 🚪 Quitter Bot                                         │")
print("└─────────────────────────────────────────────────────────────┘")
