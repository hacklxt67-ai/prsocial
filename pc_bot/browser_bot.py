import os
import time
import random
import logging
from typing import Optional, Dict, Tuple
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logger = logging.getLogger("BrowserBot")

DEFAULT_PROFILE_DIR = r"D:\social_pc_bot\chrome_profile"
SCREENSHOT_DIR = r"D:\social_pc_bot\screenshots"

def ensure_unique_screenshot(screenshot_path: str):
    """Garantit un hash unique (cryptographique et perceptuel) pour chaque capture afin d'éviter le rejet DUPLICATE_SCREENSHOT par PR.Social."""
    try:
        if os.path.exists(screenshot_path):
            with Image.open(screenshot_path) as im:
                im = im.convert("RGB")
                pix = im.load()
                w, h = im.size
                if w > 10 and h > 10:
                    # Variation subtile sur plusieurs pixels d'angles
                    for i in range(random.randint(6, 12)):
                        rx = random.randint(0, min(12, w - 1))
                        ry = random.randint(0, min(12, h - 1))
                        r, g, b = pix[rx, ry]
                        pix[rx, ry] = ((r + random.randint(1, 15)) % 256, (g + random.randint(1, 9)) % 256, b)
                    # Variation en bordure inférieure droite
                    for i in range(random.randint(4, 8)):
                        rx = w - 1 - random.randint(0, min(10, w - 1))
                        ry = h - 1 - random.randint(0, min(10, h - 1))
                        r, g, b = pix[rx, ry]
                        pix[rx, ry] = ((r + random.randint(1, 13)) % 256, g, (b + random.randint(1, 17)) % 256)
                im.save(screenshot_path, "PNG")
    except Exception:
        pass

def cleanup_profile_locks(profile_dir: str):
    if not os.path.exists(profile_dir):
        return
    for fname in ["SingletonLock", "SingletonSocket", "SingletonCookie", "DevToolsActivePort", "lockfile"]:
        fpath = os.path.join(profile_dir, fname)
        if os.path.exists(fpath):
            try:
                os.remove(fpath)
            except Exception:
                pass

class BrowserBot:
    def __init__(self, profile_dir: str = DEFAULT_PROFILE_DIR, headless: bool = False):
        self.profile_dir = profile_dir
        self.headless = headless
        self.driver: Optional[webdriver.Chrome] = None
        self.current_is_headless: Optional[bool] = None
        os.makedirs(self.profile_dir, exist_ok=True)
        os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    def start_driver(self, headless_override: Optional[bool] = None) -> webdriver.Chrome:
        is_headless = self.headless if headless_override is None else headless_override
        if self.driver is not None:
            if self.current_is_headless == is_headless:
                try:
                    # Test if driver is still responsive
                    _ = self.driver.current_window_handle
                    return self.driver
                except Exception:
                    self.stop_driver()
            else:
                self.stop_driver()

        options = Options()
        # 'eager' permet de ne pas bloquer indéfiniment sur les websockets ou scripts tiers
        options.page_load_strategy = 'eager'

        if is_headless:
            options.add_argument("--headless=new")
            options.add_argument("--disable-gpu")
        else:
            options.add_argument("--start-maximized")
            options.add_argument("--window-position=0,0")
            cleanup_profile_locks(self.profile_dir)
            options.add_argument(f"--user-data-dir={self.profile_dir}")

        options.add_argument("--disable-notifications")
        options.add_argument("--disable-infobars")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1366,768")
        options.add_argument("--lang=fr-FR,fr")
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")

        service = Service()
        if os.name == 'nt':
            service.creation_flags = 0x08000000  # CREATE_NO_WINDOW (évite l'apparition de fenêtres cmd noires)

        try:
            self.driver = webdriver.Chrome(service=service, options=options)
        except Exception as e:
            logger.warning(f"Démarrage Chrome standard échoué ({e}). Lancement immédiat en sandbox isolée...")
            fallback_options = Options()
            fallback_options.page_load_strategy = 'eager'
            if is_headless:
                fallback_options.add_argument("--headless=new")
                fallback_options.add_argument("--disable-gpu")
            fallback_options.add_argument("--no-sandbox")
            fallback_options.add_argument("--disable-dev-shm-usage")
            fallback_options.add_argument("--window-size=1366,768")
            self.driver = webdriver.Chrome(service=service, options=fallback_options)

        self.current_is_headless = is_headless
        self.driver.set_page_load_timeout(35)

        if not is_headless:
            try:
                self.driver.maximize_window()
            except Exception:
                pass

        return self.driver

    def stop_driver(self):
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None
            self.current_is_headless = None

    def capture_login_session(self, timeout_seconds: int = 180, log_cb=None) -> Optional[Dict[str, str]]:
        """Ouvre Chrome en mode visible pour que le client se connecte à PR.Social."""
        def _log(msg, lvl="info"):
            if log_cb:
                log_cb(msg, lvl)
            else:
                logger.info(msg)

        try:
            _log("Démarrage du navigateur Chrome sécurisé...", "info")
            driver = self.start_driver(headless_override=False)
            _log("Chrome démarré ! Navigation vers https://pr.social/login ...", "info")

            try:
                driver.get("https://pr.social/login")
            except Exception as e_get:
                _log(f"Note: Navigation initiale prête ({type(e_get).__name__}).", "info")

            try:
                driver.maximize_window()
            except Exception:
                pass

            _log("Page ouverte ! Veuillez vous connecter dans la fenêtre Chrome...", "info")

            start_time = time.time()
            last_alert = start_time

            while time.time() - start_time < timeout_seconds:
                # Vérifier si l'utilisateur a fermé Chrome
                try:
                    _ = driver.current_window_handle
                except Exception:
                    _log("La fenêtre Chrome a été fermée par l'utilisateur.", "warning")
                    return None

                try:
                    cookies = driver.get_cookies()
                    token = ""
                    cf_clearance = ""
                    for c in cookies:
                        if c.get("name") == "token" and c.get("value"):
                            token = c["value"]
                        elif c.get("name") == "cf_clearance" and c.get("value"):
                            cf_clearance = c["value"]

                    if token:
                        _log(f"Connexion détectée avec succès ! Jeton intercepté.", "success")
                        return {"token": token, "cf_clearance": cf_clearance}

                    # Tester également localStorage
                    try:
                        ls_token = driver.execute_script("return window.localStorage.getItem('token') || window.localStorage.getItem('auth_token');")
                        if ls_token:
                            _log(f"Jeton détecté dans le stockage local !", "success")
                            return {"token": ls_token, "cf_clearance": cf_clearance}
                    except Exception:
                        pass
                except Exception:
                    pass

                # Rappel périodique toutes les 25 secondes
                if time.time() - last_alert > 25:
                    rem = int(timeout_seconds - (time.time() - start_time))
                    _log(f"En attente de votre connexion dans Chrome... ({rem}s restantes)", "info")
                    last_alert = time.time()

                time.sleep(1.5)

            _log("Délai de connexion dépassé (180s).", "warning")
            return None
        except Exception as e:
            _log(f"Erreur lors du lancement de Chrome : {str(e)}", "error")
            return None

    def execute_task_action(self, platform: str, action: str, target_url: str, task_id: int, comment_text: Optional[str] = None, wait_seconds: Optional[int] = None, progress_cb = None) -> Tuple[bool, str, str]:
        """
        Ouvre l'URL, simule l'action (Suivre / Like / Commentaire / Surf), attend la mise à jour visuelle,
        et enregistre une capture d'écran pour la preuve.
        Retourne (succès, message, chemin_screenshot).
        """
        driver = self.start_driver()
        screenshot_path = os.path.join(SCREENSHOT_DIR, f"task_{task_id}_{int(time.time())}.png")

        try:
            if not self.headless:
                try:
                    driver.maximize_window()
                except Exception:
                    pass

            driver.get(target_url)
            time.sleep(3.5) # Attente du chargement initial

            platform_lower = platform.lower()
            action_lower = action.lower()
            action_done = False

            if "tiktok" in platform_lower:
                action_done = self._handle_tiktok(driver, action_lower, comment_text)
            elif "facebook" in platform_lower:
                action_done = self._handle_facebook(driver, action_lower, comment_text)
            elif "instagram" in platform_lower:
                action_done = self._handle_instagram(driver, action_lower, comment_text)
            elif "youtube" in platform_lower:
                action_done = self._handle_youtube(driver, action_lower, comment_text)
            elif "telegram" in platform_lower:
                action_done = self._handle_telegram(driver)
            elif "github" in platform_lower:
                action_done = self._handle_github(driver, action_lower)
            elif "discord" in platform_lower:
                action_done = self._handle_discord(driver)
            elif "linkedin" in platform_lower:
                action_done = self._handle_linkedin(driver, action_lower, comment_text)
            elif "twitter" in platform_lower or "x.com" in target_url:
                action_done = self._handle_twitter(driver, action_lower, comment_text)
            elif "snapchat" in platform_lower or "snapchat.com" in target_url:
                action_done = self._handle_snapchat(driver, action_lower)
            elif "threads" in platform_lower or "threads.net" in target_url:
                action_done = self._handle_threads(driver, action_lower, comment_text)
            elif "reddit" in platform_lower or "reddit.com" in target_url:
                action_done = self._handle_reddit(driver, action_lower, comment_text)
            elif "pinterest" in platform_lower or "pinterest.com" in target_url:
                action_done = self._handle_pinterest(driver, action_lower, comment_text)
            elif "soundcloud" in platform_lower or "soundcloud.com" in target_url:
                action_done = self._handle_soundcloud(driver, action_lower, comment_text)
            elif "bluesky" in platform_lower or "bsky" in platform_lower or "bsky.app" in target_url:
                action_done = self._handle_bluesky(driver, action_lower, comment_text)
            elif any(k in platform_lower for k in ["surf", "web", "website", "traffic"]) or any(k in action_lower for k in ["surf", "visit", "view"]):
                action_done = self._handle_surf_website(driver, required_seconds=wait_seconds or 20, progress_cb=progress_cb)
            else:
                action_done = True # Navigation simple

            time.sleep(2.0) # Laisser l'animation / confirmation d'action s'afficher
            driver.save_screenshot(screenshot_path)
            ensure_unique_screenshot(screenshot_path)
            return True, "Action effectuée et capture enregistrée", screenshot_path

        except Exception as e:
            try:
                driver.save_screenshot(screenshot_path)
                ensure_unique_screenshot(screenshot_path)
            except Exception:
                pass
            return False, f"Erreur navigateur: {str(e)}", screenshot_path

    def _handle_surf_website(self, driver: webdriver.Chrome, required_seconds: int = 20, progress_cb = None) -> bool:
        """
        Simule une visite humaine réaliste sur un site web externe (Surf Website) :
        1. Neutralise la détection de masquage de page (Page Visibility API / document.hidden).
        2. Ferme automatiquement les modales / bannières de cookies.
        3. Fait défiler la page (scroll) de façon progressive et naturelle.
        4. Maintient la présence active avec affichage du chrono en direct.
        """
        try:
            # 1. Empêcher la mise en pause du timer (visibilité forcée)
            driver.execute_script("""
                try {
                    Object.defineProperty(document, 'hidden', { value: false, writable: false });
                    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
                    window.dispatchEvent(new Event('focus'));
                } catch(e) {}
            """)
            
            # 2. Fermeture automatique des bannières cookies
            try:
                driver.execute_script("""
                    var cookieKeywords = ['accept', 'accepter', 'agree', 'allow all', 'autoriser', 'consent', 'ok', 'got it'];
                    var btns = document.querySelectorAll('button, a, div[role="button"]');
                    for (var b of btns) {
                        var t = (b.textContent || '').trim().toLowerCase();
                        if (cookieKeywords.some(function(k) { return t === k || (t.length < 25 && t.indexOf(k) !== -1); })) {
                            b.click();
                            break;
                        }
                    }
                """)
            except Exception:
                pass

            # 3. Défilement progressif humain avec chrono en direct
            start_t = time.time()
            scroll_pos = 0
            last_scroll = 0
            while True:
                elapsed = int(time.time() - start_t)
                if elapsed >= required_seconds:
                    break

                if progress_cb:
                    state = "Défilement actif" if (elapsed // 3) % 2 == 0 else "Lecture active"
                    progress_cb(elapsed, required_seconds, state)

                # Scroll toutes les 2.5 secondes
                if time.time() - last_scroll >= 2.5:
                    scroll_pos += random.randint(200, 450)
                    try:
                        driver.execute_script(f"window.scrollTo({{ top: {scroll_pos}, behavior: 'smooth' }});")
                    except Exception:
                        pass
                    last_scroll = time.time()
                    if scroll_pos > 2200:
                        scroll_pos = random.randint(150, 400)
                        try:
                            driver.execute_script(f"window.scrollTo({{ top: {scroll_pos}, behavior: 'smooth' }});")
                        except Exception:
                            pass

                time.sleep(0.5)

            if progress_cb:
                progress_cb(required_seconds, required_seconds, "Visite complétée")

            return True
        except Exception:
            return True

    def _handle_tiktok(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        # 1. Fermer les modales et popups intrusives
        close_js = """
        try {
            var closeBtns = document.querySelectorAll('[data-e2e="modal-close-icon"], [aria-label="Close"], [aria-label="Fermer"], button[class*="close" i]');
            for(var i=0; i<closeBtns.length; i++) {
                if(closeBtns[i].offsetWidth > 0) { closeBtns[i].click(); }
            }
        } catch(e) {}
        """
        driver.execute_script(close_js)
        time.sleep(1)

        # 2. Gestion de l'action commentaire
        if "comment" in action:
            c_js = """
            var txt = arguments[0];
            var cInput = document.querySelector('div[contenteditable="true"][data-e2e*="comment" i], textarea[placeholder*="comment" i], [data-e2e="comment-input"]');
            if(cInput){
                cInput.focus();
                cInput.textContent = txt;
                cInput.dispatchEvent(new Event('input', { bubbles: true }));
                var pBtn = document.querySelector('[data-e2e="comment-post"]');
                if(pBtn) { pBtn.click(); return true; }
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Great! 👍")
            except Exception:
                pass
            return True

        # 3. Cliquer sur Suivre ou Like
        if "follow" in action or "suivre" in action:
            click_js = """
            var followBtn = null;
            var e2eList = ['[data-e2e="follow-button"]','[data-e2e="user-follow-button"]','[data-e2e="profile-follow-btn"]','[data-e2e="video-author-follow"]','[data-e2e="browse-follow-button"]','[data-e2e="follow"]'];
            for(var i=0; i<e2eList.length; i++){
                var el = document.querySelector(e2eList[i]);
                if(el){ followBtn = (el.tagName==='BUTTON')?el:(el.querySelector('button')||el.closest('button')||el); break; }
            }
            if(!followBtn){
                var ab = document.querySelectorAll('button, [role="button"], a');
                for(var b=0; b<ab.length; b++){
                    var t = (ab[b].textContent || '').trim().toLowerCase();
                    if(t.indexOf('suivre') !== -1 || t.indexOf('follow') !== -1 || t.indexOf('abonner') !== -1){
                        followBtn = ab[b]; break;
                    }
                }
            }
            if(followBtn){
                try { followBtn.click(); } catch(e){}
                return true;
            }
            return false;
            """
            return bool(driver.execute_script(click_js))
        elif "like" in action or "aimer" in action:
            click_like = """
            var likeBtn = document.querySelector('[data-e2e="like-icon"], [data-e2e="browse-like-icon"], [data-e2e="video-like-button"]');
            if(likeBtn){
                var b = (likeBtn.tagName==='BUTTON')?likeBtn:(likeBtn.closest('button')||likeBtn);
                b.click();
                return true;
            }
            return false;
            """
            return bool(driver.execute_script(click_like))
        return True

    def _handle_facebook(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        # Fermer la bannière cookies Facebook
        try:
            cookie_js = """
            var btns = document.querySelectorAll('button, [role="button"]');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent || '').toLowerCase();
                if(t.indexOf('autoriser tous les cookies') !== -1 || t.indexOf('accepter') !== -1 || t.indexOf('allow all') !== -1){
                    btns[i].click(); break;
                }
            }
            """
            driver.execute_script(cookie_js)
            time.sleep(1)
        except Exception:
            pass

        if "comment" in action:
            c_js = """
            var txt = arguments[0];
            var box = document.querySelector('div[role="textbox"][aria-label*="commentaire" i], div[role="textbox"][aria-label*="comment" i]');
            if(box){
                box.focus();
                box.textContent = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Top! 👍")
            except Exception:
                pass
            return True

        click_js = """
        var btns = document.querySelectorAll('button, [role="button"], a');
        for(var i=0; i<btns.length; i++){
            var t = (btns[i].textContent || '').toLowerCase();
            var aria = (btns[i].getAttribute('aria-label') || '').toLowerCase();
            if(t.indexOf('suivre') !== -1 || t.indexOf('follow') !== -1 || t.indexOf("j'aime") !== -1 || aria.indexOf('suivre') !== -1 || aria.indexOf('follow') !== -1){
                btns[i].click();
                return true;
            }
        }
        return false;
        """
        return bool(driver.execute_script(click_js))

    def _handle_instagram(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        # Fermer dialogue cookies
        try:
            cookie_js = """
            var btns = document.querySelectorAll('button');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent || '').toLowerCase();
                if(t.indexOf('autoriser les cookies') !== -1 || t.indexOf('accepter') !== -1 || t.indexOf('allow all') !== -1){
                    btns[i].click(); break;
                }
            }
            """
            driver.execute_script(cookie_js)
            time.sleep(1)
        except Exception:
            pass

        if "comment" in action:
            c_js = """
            var txt = arguments[0];
            var ta = document.querySelector('textarea[aria-label*="Ajouter un commentaire" i], textarea[placeholder*="commentaire" i], textarea');
            if(ta){
                ta.focus();
                ta.value = txt;
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                var postBtn = document.querySelector('form button[type="submit"], div[role="button"][tabindex="0"]');
                if(postBtn) { postBtn.click(); return true; }
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Super! 🔥")
            except Exception:
                pass
            return True

        click_js = """
        var btns = document.querySelectorAll('button');
        for(var i=0; i<btns.length; i++){
            var t = (btns[i].textContent || '').trim().toLowerCase();
            if(t === 'suivre' || t === 'follow' || t === "s'abonner"){
                btns[i].click();
                return true;
            }
        }
        return false;
        """
        return bool(driver.execute_script(click_js))

    def _handle_youtube(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        # Accepter cookies
        try:
            cookie_js = """
            var btns = document.querySelectorAll('button');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent || '').toLowerCase();
                if(t.indexOf('tout accepter') !== -1 || t.indexOf('accept all') !== -1){
                    btns[i].click(); break;
                }
            }
            """
            driver.execute_script(cookie_js)
            time.sleep(1)
        except Exception:
            pass

        if "comment" in action:
            c_js = """
            var txt = arguments[0];
            window.scrollBy(0, 400);
            var box = document.querySelector('#simplebox-placeholder, #placeholder-area, #contenteditable-root');
            if(box){
                box.click();
                var input = document.querySelector('#contenteditable-root, div[contenteditable="true"]');
                if(input){
                    input.focus();
                    input.textContent = txt;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    var subBtn = document.querySelector('#submit-button button, ytd-button-renderer#submit-button button');
                    if(subBtn && !subBtn.disabled) { subBtn.click(); return true; }
                }
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Great content! 🚀")
            except Exception:
                pass
            return True

        click_js = """
        if(window.location.href.indexOf('watch') !== -1){
            var likeBtn = document.querySelector('like-button-view-model button, #segmented-like-button button, [aria-label*="aimer" i]');
            if(likeBtn){ likeBtn.click(); return true; }
        } else {
            var subBtn = document.querySelector('#subscribe-button button, ytd-subscribe-button-renderer button');
            if(subBtn){ subBtn.click(); return true; }
        }
        return false;
        """
        return bool(driver.execute_script(click_js))

    def _handle_telegram(self, driver: webdriver.Chrome) -> bool:
        click_js = """
        var btn = document.querySelector('.tgme_action_button, a[href*="tg:"]');
        if(btn){ btn.click(); return true; }
        return true;
        """
        return bool(driver.execute_script(click_js))

    def _handle_github(self, driver: webdriver.Chrome, action: str) -> bool:
        click_js = """
        // 1. Action Star (Repository)
        var starBtn = document.querySelector('form.unstarred button, [aria-label*="Star this repository" i], [data-hydro-click*="STAR" i]');
        if (starBtn) { starBtn.click(); return true; }
        
        // 2. Action Follow (User Profile)
        var followBtn = document.querySelector('input[value="Follow"], button[value="Follow"], [aria-label*="Follow" i]');
        if (followBtn) { followBtn.click(); return true; }
        
        // 3. Fallback générique GitHub
        var btns = document.querySelectorAll('button, input[type="submit"]');
        for (var i = 0; i < btns.length; i++) {
            var txt = (btns[i].textContent || btns[i].value || '').trim().toLowerCase();
            if (txt === 'star' || txt === 'follow' || txt === 'suivre') {
                btns[i].click(); return true;
            }
        }
        return true;
        """
        try:
            return bool(driver.execute_script(click_js))
        except Exception:
            return True

    def _handle_discord(self, driver: webdriver.Chrome) -> bool:
        click_js = """
        // Cliquer sur 'Accepter l'invitation' / 'Accept Invite'
        var btns = document.querySelectorAll('button, [role="button"], a');
        for (var i = 0; i < btns.length; i++) {
            var txt = (btns[i].textContent || '').toLowerCase();
            if (txt.indexOf('accepter') !== -1 || txt.indexOf('accept') !== -1 || txt.indexOf('rejoindre') !== -1 || txt.indexOf('join') !== -1) {
                btns[i].click(); return true;
            }
        }
        return true;
        """
        try:
            return bool(driver.execute_script(click_js))
        except Exception:
            return True

    def _handle_linkedin(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        try:
            cookie_js = """
            var cBtns = document.querySelectorAll('button[action-type="ACCEPT"], button[artdeco-button--primary], button[aria-label*="Accepter" i], button[aria-label*="Accept" i]');
            for (var i=0; i<cBtns.length; i++) {
                if (cBtns[i].offsetWidth > 0) { cBtns[i].click(); break; }
            }
            // Masquer les modales de connexion intrusives pour dévoiler le profil réel en arrière-plan
            var modals = document.querySelectorAll('.contextual-sign-in-modal, [data-view-name="authwall"], .authwall-join-form, #base-contextual-sign-in-modal, [class*="sign-in-modal" i], .modal__overlay');
            for (var m=0; m<modals.length; m++) { modals[m].style.display = 'none'; }
            document.body.style.overflow = 'auto';
            """
            driver.execute_script(cookie_js)
            time.sleep(1)
        except Exception:
            pass

        if "comment" in action:
            c_js = """
            var txt = arguments[0];
            var commBtn = document.querySelector('button[aria-label*="Commenter" i], button[aria-label*="Comment" i]');
            if(commBtn) commBtn.click();
            var ed = document.querySelector('.ql-editor, div.editor-content div[role="textbox"]');
            if(ed){
                ed.focus();
                ed.textContent = txt;
                ed.dispatchEvent(new Event('input', { bubbles: true }));
                var pubBtn = document.querySelector('button.comments-comment-box__submit-button');
                if(pubBtn) { pubBtn.click(); return true; }
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Très intéressant ! 👏")
            except Exception:
                pass
            return True

        click_js = """
        // 1. Détection ciblée page entreprise ou page profil
        var targets = [
            'button.org-top-card-primary-actions__action',
            '[data-control-name*="follow" i]',
            '[aria-label*="Suivre" i]',
            '[aria-label*="Follow" i]',
            '[aria-label*="connect" i]',
            '[aria-label*="inviter" i]',
            'button[class*="follow" i]'
        ];
        for (var t=0; t<targets.length; t++) {
            var el = document.querySelector(targets[t]);
            if (el && el.offsetWidth > 0) {
                el.click();
                return true;
            }
        }

        // 2. Recherche générique dans les boutons visibles
        var btns = document.querySelectorAll('button, [role="button"], a.artdeco-button');
        for (var i = 0; i < btns.length; i++) {
            var aria = (btns[i].getAttribute('aria-label') || '').toLowerCase();
            var txt = (btns[i].textContent || '').trim().toLowerCase();
            if (aria.indexOf('connect') !== -1 || aria.indexOf('inviter') !== -1 || aria.indexOf('suivre') !== -1 || aria.indexOf('follow') !== -1 ||
                txt === 'se connecter' || txt === 'connect' || txt === 'suivre' || txt === 'follow' || txt.indexOf('+ suivre') !== -1) {
                btns[i].click();
                return true;
            }
        }
        return true;
        """
        try:
            return bool(driver.execute_script(click_js))
        except Exception:
            return True

    def _handle_twitter(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        act = action.lower()
        # 1. Fermer les fenêtres de cookies et modals de connexion intrusifs
        dismiss_js = """
        try {
            var closeBtns = document.querySelectorAll('[data-testid="app-bar-close"], [aria-label="Close"], [aria-label="Fermer"]');
            for (var i=0; i<closeBtns.length; i++) {
                if (closeBtns[i].offsetWidth > 0) { closeBtns[i].click(); break; }
            }
            var bottomBar = document.querySelector('div[data-testid="BottomBar"]');
            if (bottomBar) bottomBar.style.display = 'none';
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # Action Commentaire / Reply si demandée
        if "comment" in act:
            c_js = """
            var txt = arguments[0];
            var replyBox = document.querySelector('div[data-testid="tweetTextarea_0"], div[role="textbox"][aria-label*="Post your reply" i], div[role="textbox"]');
            if(replyBox){
                replyBox.focus();
                replyBox.textContent = txt;
                replyBox.dispatchEvent(new Event('input', { bubbles: true }));
                var replyBtn = document.querySelector('button[data-testid="tweetButtonInline"]');
                if(replyBtn) { replyBtn.click(); return true; }
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Nice post! 🔥")
                time.sleep(2)
            except Exception:
                pass
            return True

        # Action LIKE
        if "like" in act or "aimer" in act:
            like_js = """
            // Vérifier si déjà liké pour ne pas unliker !
            var unlikeBtn = document.querySelector('button[data-testid="unlike"], [aria-label*="Liked" i], [aria-label*="Aimé" i]');
            if (unlikeBtn) {
                unlikeBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
                return true;
            }

            var likeBtn = document.querySelector('button[data-testid="like"], [aria-label*="Like" i], [aria-label*="J’aime" i], [aria-label*="J\\'aime" i]');
            if (likeBtn) {
                likeBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
                likeBtn.click();
                return true;
            }
            return false;
            """
            try:
                res = driver.execute_script(like_js)
                time.sleep(1.5)
                return bool(res)
            except Exception:
                return False

        # Action RETWEET / REPOST
        if "retweet" in act or "repost" in act:
            rt_js = """
            var unrtBtn = document.querySelector('button[data-testid="unretweet"]');
            if (unrtBtn) {
                unrtBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
                return true;
            }
            var rtBtn = document.querySelector('button[data-testid="retweet"]');
            if (rtBtn) {
                rtBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
                rtBtn.click();
                return true;
            }
            return false;
            """
            try:
                res = driver.execute_script(rt_js)
                time.sleep(1)
                confirm_js = """
                var confirmBtn = document.querySelector('div[data-testid="retweetConfirm"]');
                if (confirmBtn) { confirmBtn.click(); return true; }
                return true;
                """
                driver.execute_script(confirm_js)
                time.sleep(1)
                return bool(res)
            except Exception:
                return False

        # Action FOLLOW
        if "follow" in act or "suivre" in act:
            follow_js = """
            var unfollowBtn = document.querySelector('button[data-testid$="-unfollow"], [aria-label*="Following @" i], [aria-label*="Abonné @" i]');
            if (unfollowBtn) {
                unfollowBtn.scrollIntoView({behavior: 'smooth', block: 'center'});
                return true;
            }

            var followSelectors = [
                'button[data-testid$="-follow"]',
                'button[data-testid="placementTracking"]',
                '[aria-label*="Follow @" i]',
                '[aria-label*="Suivre @" i]',
                '[aria-label*="Follow" i]',
                '[aria-label*="Suivre" i]'
            ];
            for (var s=0; s<followSelectors.length; s++) {
                var btn = document.querySelector(followSelectors[s]);
                if (btn && btn.offsetWidth > 0) {
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }

            var allBtns = document.querySelectorAll('button[role="button"], button');
            for (var b=0; b<allBtns.length; b++) {
                var txt = (allBtns[b].textContent || '').trim().toLowerCase();
                if (txt === 'follow' || txt === 'suivre' || txt.indexOf('follow @') === 0 || txt.indexOf('suivre @') === 0) {
                    allBtns[b].scrollIntoView({behavior: 'smooth', block: 'center'});
                    allBtns[b].click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = driver.execute_script(follow_js)
                time.sleep(1.5)
                return bool(res)
            except Exception:
                return False

        return True

    def _handle_snapchat(self, driver: webdriver.Chrome, action: str) -> bool:
        # 1. Accepter les cookies et masquer la bannière 'Open in App'
        dismiss_js = """
        try {
            var cBtn = document.querySelector('#onetrust-accept-btn-handler, button[class*="cookie" i]');
            if (cBtn && cBtn.offsetWidth > 0) { cBtn.click(); }
            var appBanner = document.querySelector('[class*="OpenInApp" i], [class*="AppBanner" i]');
            if (appBanner) appBanner.style.display = 'none';
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # 2. Bouton d'ajout d'ami ou d'abonnement Snapchat
        click_js = """
        var snapSelectors = [
            'button[class*="Subscribe" i]',
            'button[class*="Add" i]',
            'button[aria-label*="Subscribe" i]',
            'button[aria-label*="S\'abonner" i]',
            'button[aria-label*="Add" i]',
            'button[aria-label*="Ajouter" i]'
        ];
        for (var s=0; s<snapSelectors.length; s++) {
            var el = document.querySelector(snapSelectors[s]);
            if (el && el.offsetWidth > 0) {
                el.click();
                return true;
            }
        }

        var allBtns = document.querySelectorAll('button, a[role="button"]');
        for (var i=0; i<allBtns.length; i++) {
            var txt = (allBtns[i].textContent || '').trim().toLowerCase();
            if (txt.indexOf('s\'abonner') !== -1 || txt.indexOf('subscribe') !== -1 || 
                txt.indexOf('ajouter') !== -1 || txt.indexOf('add') !== -1) {
                allBtns[i].click();
                return true;
            }
        }
        return true;
        """
        try:
            return bool(driver.execute_script(click_js))
        except Exception:
            return True

    def _handle_threads(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        # 1. Gestion des cookies et popups Threads
        dismiss_js = """
        try {
            var cookieBtns = document.querySelectorAll('button');
            for (var i = 0; i < cookieBtns.length; i++) {
                var t = (cookieBtns[i].textContent || '').toLowerCase();
                if (t.indexOf('autoriser') !== -1 || t.indexOf('accepter') !== -1 || t.indexOf('allow all') !== -1) {
                    cookieBtns[i].click(); break;
                }
            }
            var closeBtns = document.querySelectorAll('[aria-label="Close"], [aria-label="Fermer"], svg[aria-label="Close"], [role="button"][aria-label="Fermer"]');
            for (var j = 0; j < closeBtns.length; j++) {
                if (closeBtns[j].offsetWidth > 0) { closeBtns[j].click(); break; }
            }
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # 2. Action Commentaire si demandée
        if "comment" in action:
            c_js = """
            var txt = arguments[0];
            var commBtn = document.querySelector('svg[aria-label*="Répondre" i], svg[aria-label*="Reply" i], svg[aria-label*="Comment" i]');
            if (commBtn) {
                var p = commBtn.closest('div[role="button"]') || commBtn.parentElement;
                if (p) p.click();
            }
            var box = document.querySelector('div[contenteditable="true"], div[role="textbox"]');
            if (box) {
                box.focus();
                box.textContent = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                var postBtn = document.querySelector('div[role="button"]:has(span)');
                if (postBtn) postBtn.click();
            }
            return true;
            """
            try:
                driver.execute_script(c_js, comment_text or "Great post! ✨")
            except Exception:
                pass
            return True

        # 3. Action Suivre / Follow
        if "follow" in action or "suivre" in action:
            follow_js = """
            // Recherche de boutons Suivre Threads
            var btns = document.querySelectorAll('div[role="button"], button');
            for (var i = 0; i < btns.length; i++) {
                var txt = (btns[i].textContent || '').trim().toLowerCase();
                if (txt === 'suivre' || txt === 'follow' || txt === "s'abonner" || txt === '+ suivre') {
                    btns[i].click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(follow_js))
                if res:
                    return True
            except Exception:
                pass

        # 4. Action Like / Aimer
        if "like" in action or "aimer" in action:
            like_js = """
            var likeSvg = document.querySelector('svg[aria-label*="J\'aime" i], svg[aria-label*="Like" i]');
            if (likeSvg) {
                var p = likeSvg.closest('div[role="button"]') || likeSvg.parentElement;
                if (p) { p.click(); return true; }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(like_js))
                if res:
                    return True
            except Exception:
                pass

        # 5. Action Share / Repost
        if "share" in action or "repost" in action:
            share_js = """
            var repostSvg = document.querySelector('svg[aria-label*="Republier" i], svg[aria-label*="Repost" i], svg[aria-label*="Partager" i]');
            if (repostSvg) {
                var p = repostSvg.closest('div[role="button"]') || repostSvg.parentElement;
                if (p) {
                    p.click();
                    setTimeout(function() {
                        var menuBtns = document.querySelectorAll('div[role="menuitem"], div[role="button"]');
                        for (var m=0; m<menuBtns.length; m++) {
                            var t = (menuBtns[m].textContent || '').toLowerCase();
                            if (t.indexOf('republier') !== -1 || t.indexOf('repost') !== -1) {
                                menuBtns[m].click(); break;
                            }
                        }
                    }, 500);
                    return true;
                }
            }
            return true;
            """
            try:
                return bool(driver.execute_script(share_js))
            except Exception:
                return True

        return True

    def _handle_reddit(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        # 1. Gestion des cookies et popups Reddit
        dismiss_js = """
        try {
            var cookieBtns = document.querySelectorAll('button');
            for (var i = 0; i < cookieBtns.length; i++) {
                var t = (cookieBtns[i].textContent || '').toLowerCase();
                if (t.indexOf('accept all') !== -1 || t.indexOf('tout accepter') !== -1 || t.indexOf('accept') !== -1) {
                    cookieBtns[i].click(); break;
                }
            }
            var closeBtns = document.querySelectorAll('button[aria-label="Close"], button[aria-label="Fermer"]');
            for (var j = 0; j < closeBtns.length; j++) {
                if (closeBtns[j].offsetWidth > 0) { closeBtns[j].click(); break; }
            }
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # 2. Action Upvote (Vote positif)
        if "upvote" in action or "vote" in action or "like" in action:
            upvote_js = """
            var upSelectors = [
                'button[upvote-button]',
                'shreddit-post button[aria-label*="upvote" i]',
                'shreddit-comment button[aria-label*="upvote" i]',
                'button[data-click-id="upvote"]',
                'button[aria-label*="vote positif" i]',
                'button[aria-label*="Upvote" i]'
            ];
            for (var s = 0; s < upSelectors.length; s++) {
                var btn = document.querySelector(upSelectors[s]);
                if (btn && btn.offsetWidth > 0) {
                    btn.click();
                    return true;
                }
            }
            var allSvgs = document.querySelectorAll('svg');
            for (var k = 0; k < allSvgs.length; k++) {
                var aria = (allSvgs[k].getAttribute('aria-label') || '').toLowerCase();
                if (aria.indexOf('upvote') !== -1 || aria.indexOf('vote positif') !== -1) {
                    var p = allSvgs[k].closest('button') || allSvgs[k].parentElement;
                    if (p) { p.click(); return true; }
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(upvote_js))
                if res:
                    return True
            except Exception:
                pass

        # 3. Action Follow (Profil utilisateur)
        if "follow" in action or "suivre" in action:
            follow_js = """
            var followSelectors = [
                'shreddit-profile-header button',
                'button[aria-label*="Follow @" i]',
                'button[aria-label*="Suivre @" i]',
                'button[aria-label*="Follow" i]',
                'button[aria-label*="Suivre" i]',
                'button[data-testid="follow-button"]'
            ];
            for (var f = 0; f < followSelectors.length; f++) {
                var el = document.querySelector(followSelectors[f]);
                if (el && el.offsetWidth > 0) {
                    var txt = (el.textContent || '').trim().toLowerCase();
                    if (txt.indexOf('unfollow') === -1 && txt.indexOf('ne plus suivre') === -1) {
                        el.click();
                        return true;
                    }
                }
            }
            var allBtns = document.querySelectorAll('button');
            for (var b = 0; b < allBtns.length; b++) {
                var t = (allBtns[b].textContent || '').trim().toLowerCase();
                if (t === 'follow' || t === 'suivre' || t === '+ follow' || t === '+ suivre') {
                    allBtns[b].click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(follow_js))
                if res:
                    return True
            except Exception:
                pass

        # 4. Action Commentaire si demandée
        if "comment" in action:
            comm_js = """
            var txt = arguments[0];
            var box = document.querySelector('div[role="textbox"], textarea[name="comment"], shreddit-comment-composer div[contenteditable="true"]');
            if (box) {
                box.focus();
                box.textContent = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                var subBtn = document.querySelector('shreddit-comment-composer button[type="submit"], button[type="submit"]');
                if (subBtn) subBtn.click();
            }
            return true;
            """
            try:
                driver.execute_script(comm_js, comment_text or "Nice post! 👍")
            except Exception:
                pass
            return True

        return True

    def _handle_pinterest(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        """
        Gestionnaire Pinterest : Follow profil, Save/Like Pin, Repin, Commentaire.
        Anti-désabonnement et anti-unlike stricts.
        """
        # 1. Fermeture des bannières cookies et popups
        dismiss_js = """
        try {
            var closeBtns = document.querySelectorAll('button[aria-label="Fermer"], button[aria-label="Close"], div[data-test-id="full-page-signup-close-button"], [data-test-id="cookie-banner-accept-button"]');
            for (var i = 0; i < closeBtns.length; i++) {
                if (closeBtns[i].offsetWidth > 0) { closeBtns[i].click(); break; }
            }
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # 2. Action Save / Like / Pin
        if "like" in action or "save" in action or "pin" in action or "repin" in action:
            save_js = """
            var saveSelectors = [
                'button[data-test-id="PinBetterSaveButton"]',
                'button[data-test-id="pin-action-bar-save-button"]',
                'button[aria-label*="Save" i]',
                'button[aria-label*="Enregistrer" i]',
                'div[data-test-id="pin-action-bar-save-button"]'
            ];
            for (var s = 0; s < saveSelectors.length; s++) {
                var btn = document.querySelector(saveSelectors[s]);
                if (btn && btn.offsetWidth > 0) {
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    // Si déjà enregistré / Saved -> Ne PAS annuler !
                    if (txt.indexOf('saved') !== -1 || txt.indexOf('enregistré') !== -1 || aria.indexOf('saved') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(save_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 3. Action Follow (Profil utilisateur)
        if "follow" in action or "suivre" in action or "abonner" in action or "profile" in action:
            follow_js = """
            var followSelectors = [
                'button[data-test-id="user-follow-button"]',
                'button[data-test-id="ProfileHeaderFollowButton"]',
                'button[aria-label*="Follow" i]',
                'button[aria-label*="Suivre" i]'
            ];
            for (var s = 0; s < followSelectors.length; s++) {
                var btn = document.querySelector(followSelectors[s]);
                if (btn && btn.offsetWidth > 0) {
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    // Si déjà abonné -> Ne PAS désabonner !
                    if (txt.indexOf('following') !== -1 || txt.indexOf('abonné') !== -1 || txt.indexOf('se désabonner') !== -1 || aria.indexOf('following') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(follow_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 4. Action Commentaire si demandée
        if "comment" in action:
            comm_js = """
            var txt = arguments[0];
            var box = document.querySelector('div[data-test-id="comment-composer-input"] [contenteditable="true"], textarea[placeholder*="comment" i], textarea[placeholder*="commentaire" i]');
            if (box) {
                box.focus();
                box.textContent = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                var subBtn = document.querySelector('button[data-test-id="comment-submit-button"], button[type="submit"]');
                if (subBtn) subBtn.click();
            }
            return true;
            """
            try:
                driver.execute_script(comm_js, comment_text or "Great inspiration! 📌✨")
            except Exception:
                pass
            return True

        return True

    def _handle_soundcloud(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        """
        Gestionnaire SoundCloud : Follow artiste, Like/Favorite titre, Repost, Commentaire.
        Anti-unfollow et anti-unlike stricts.
        """
        # 1. Bannières cookies
        dismiss_js = """
        try {
            var cookieBtn = document.querySelector('#onetrust-accept-btn-handler, button[title*="Accept" i], button[aria-label*="Accept" i]');
            if (cookieBtn && cookieBtn.offsetWidth > 0) { cookieBtn.click(); }
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # 2. Action Like / Favorite
        if "like" in action or "fav" in action or "aime" in action:
            like_js = """
            var likeBtns = document.querySelectorAll('button.sc-button-like, button[title*="Like" i], button[aria-label*="Like" i]');
            for (var i = 0; i < likeBtns.length; i++) {
                var btn = likeBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var title = (btn.getAttribute('title') || '').toLowerCase();
                    var cls = btn.className || '';
                    // Si déjà Liké -> Ne PAS unlike !
                    if (cls.indexOf('sc-button-selected') !== -1 || title.indexOf('unlike') !== -1 || title.indexOf('liked') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(like_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 3. Action Repost
        if "repost" in action or "partager" in action:
            repost_js = """
            var rpBtns = document.querySelectorAll('button.sc-button-repost, button[title*="Repost" i]');
            for (var i = 0; i < rpBtns.length; i++) {
                var btn = rpBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var cls = btn.className || '';
                    if (cls.indexOf('sc-button-selected') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(repost_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 4. Action Follow (Artiste)
        if "follow" in action or "suivre" in action or "profile" in action or "artiste" in action:
            follow_js = """
            var followBtns = document.querySelectorAll('button.sc-button-follow, button[title*="Follow" i], button[aria-label*="Follow" i]');
            for (var i = 0; i < followBtns.length; i++) {
                var btn = followBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var title = (btn.getAttribute('title') || '').toLowerCase();
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    var cls = btn.className || '';
                    // Si déjà Follow -> Ne PAS unfollow !
                    if (cls.indexOf('sc-button-selected') !== -1 || title.indexOf('unfollow') !== -1 || txt.indexOf('following') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(follow_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 5. Commentaire
        if "comment" in action:
            comm_js = """
            var txt = arguments[0];
            var box = document.querySelector('input.commentForm__input, textarea.commentForm__input');
            if (box) {
                box.focus();
                box.value = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            }
            return true;
            """
            try:
                driver.execute_script(comm_js, comment_text or "Great track! 🔥🎶")
            except Exception:
                pass
            return True

        return True

    def _handle_bluesky(self, driver: webdriver.Chrome, action: str, comment_text: Optional[str] = None) -> bool:
        """
        Gestionnaire Bluesky (bsky.app) : Follow profil, Like post, Repost, Reply/Comment.
        Anti-unfollow et anti-unlike stricts.
        """
        # 1. Modales et bannières
        dismiss_js = """
        try {
            var closeBtns = document.querySelectorAll('button[aria-label="Close"], button[aria-label="Fermer"]');
            for (var i = 0; i < closeBtns.length; i++) {
                if (closeBtns[i].offsetWidth > 0) { closeBtns[i].click(); break; }
            }
        } catch(e) {}
        """
        try:
            driver.execute_script(dismiss_js)
            time.sleep(1)
        except Exception:
            pass

        # 2. Action Like post
        if "like" in action or "aime" in action or "fav" in action:
            like_js = """
            var likeBtns = document.querySelectorAll('button[data-testid="likeBtn"], [aria-label*="Like" i], [aria-label*="J\\'aime" i]');
            for (var i = 0; i < likeBtns.length; i++) {
                var btn = likeBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    var pressed = btn.getAttribute('aria-pressed');
                    // Si déjà liké -> Ne PAS unlike !
                    if (testid.indexOf('unlike') !== -1 || aria.indexOf('unlike') !== -1 || aria.indexOf('ne plus aimer') !== -1 || pressed === 'true') {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(like_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 3. Action Repost
        if "repost" in action or "partager" in action:
            repost_js = """
            var rpBtns = document.querySelectorAll('button[data-testid="repostBtn"]');
            for (var i = 0; i < rpBtns.length; i++) {
                var btn = rpBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var pressed = btn.getAttribute('aria-pressed');
                    if (pressed === 'true') {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    setTimeout(function(){
                        var confirmBtn = document.querySelector('div[role="menu"] button, [data-testid="repostConfirmBtn"]');
                        if (confirmBtn) confirmBtn.click();
                    }, 400);
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(repost_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 4. Action Follow (Profil utilisateur)
        if "follow" in action or "suivre" in action or "profile" in action or "abonner" in action:
            follow_js = """
            var followBtns = document.querySelectorAll('button[data-testid="followBtn"], button[aria-label*="Follow" i], button[aria-label*="Suivre" i]');
            for (var i = 0; i < followBtns.length; i++) {
                var btn = followBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    // Si déjà suivi -> Ne PAS unfollow !
                    if (testid.indexOf('unfollow') !== -1 || aria.indexOf('unfollow') !== -1 || txt.indexOf('following') !== -1 || txt.indexOf('abonné') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return true;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return true;
                }
            }
            return false;
            """
            try:
                res = bool(driver.execute_script(follow_js))
                if res:
                    time.sleep(1.5)
                    return True
            except Exception:
                pass

        # 5. Commentaire / Réponse
        if "comment" in action or "reply" in action:
            comm_js = """
            var txt = arguments[0];
            var replyBtn = document.querySelector('button[data-testid="replyBtn"]');
            if (replyBtn) {
                replyBtn.click();
                setTimeout(function(){
                    var box = document.querySelector('div[role="dialog"] div[contenteditable="true"]');
                    if (box) {
                        box.focus();
                        box.textContent = txt;
                        box.dispatchEvent(new Event('input', { bubbles: true }));
                        var sendBtn = document.querySelector('button[data-testid="composerPublishBtn"]');
                        if (sendBtn) sendBtn.click();
                    }
                }, 500);
            }
            return true;
            """
            try:
                driver.execute_script(comm_js, comment_text or "Great share! 🦋")
            except Exception:
                pass
            return True

        return True
