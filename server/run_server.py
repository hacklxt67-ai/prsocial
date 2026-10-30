import os
import sys
import uvicorn

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)

    print("============================================================")
    print("[*] Demarrage du Serveur FastAPI PR.Social (Licences & Paiements)")
    print("============================================================")
    print("Dashboard d'administration : http://127.0.0.1:8000")
    print("Documentation Swagger API  : http://127.0.0.1:8000/docs")
    print("Identifiants Admin         : admin / Admin1234!")
    print("============================================================")
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
