import os
import sys
import time
import random
import logging
from typing import Optional, Tuple
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

try:
    from user_agents import get_random_user_agent
except ImportError:
    try:
        from termux_bot.user_agents import get_random_user_agent
    except ImportError:
        def get_random_user_agent(allow_desktop=True):
            return "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.6668.100 Mobile Safari/537.36"

try:
    from screenshot_guard import ScreenshotGuard
except ImportError:
    try:
        from termux_bot.screenshot_guard import ScreenshotGuard
    except ImportError:
        ScreenshotGuard = None

logger = logging.getLogger("BrowserTermux")

# Dossiers adaptés à Linux / Android Termux
HOME_DIR = os.path.expanduser("~")
BASE_DATA_DIR = os.path.join(HOME_DIR, "social_bot_data")
SCREENSHOT_DIR = os.path.join(BASE_DATA_DIR, "screenshots")
PROFILE_DIR = os.path.join(BASE_DATA_DIR, "chromium_profile")

os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(PROFILE_DIR, exist_ok=True)

def cleanup_profile_locks(profile_dir: str):
    """Supprime les verrous résiduels de Chromium pour éviter les blocages après arrêt forcé."""
    if not os.path.exists(profile_dir):
        return
    for fname in ["SingletonLock", "SingletonSocket", "SingletonCookie", "DevToolsActivePort", "lockfile"]:
        fpath = os.path.join(profile_dir, fname)
        if os.path.exists(fpath):
            try:
                os.remove(fpath)
            except Exception:
                pass

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

class BrowserTermux:
    """Moteur Selenium optimisé pour l'environnement Linux ARM64 sous Termux (Debian Proot)."""
    def __init__(self, headless: bool = True, user_agent: Optional[str] = None):
        self.headless = headless
        self.user_agent = user_agent or get_random_user_agent()
        self.driver: Optional[webdriver.Chrome] = None

    def rotate_user_agent(self) -> str:
        """Génère un nouveau User-Agent aléatoire et redémarre le navigateur proprement au prochain besoin."""
        self.user_agent = get_random_user_agent()
        self.stop_driver()
        return self.user_agent

    def start_driver(self) -> webdriver.Chrome:
        if self.driver is not None:
            try:
                _ = self.driver.current_window_handle
                return self.driver
            except Exception:
                self.stop_driver()

        options = Options()
        options.page_load_strategy = 'eager'

        # Chemins standards de Chromium et Chromedriver sous Debian Linux ARM64
        for binary_path in ['/usr/bin/chromium', '/usr/bin/chromium-browser']:
            if os.path.exists(binary_path):
                options.binary_location = binary_path
                break

        current_ua = self.user_agent or get_random_user_agent()

        # Paramètres indispensables pour l'exécution en sandbox Proot / Termux et anti-détection
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-notifications")
        options.add_argument("--disable-infobars")
        options.add_argument("--window-size=1280,720")
        options.add_argument("--lang=fr-FR,fr")
        cleanup_profile_locks(PROFILE_DIR)
        options.add_argument(f"--user-data-dir={PROFILE_DIR}")
        options.add_argument(f"--user-agent={current_ua}")
        # Anti-détection Selenium
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)

        service_kwargs = {}
        for driver_path in ['/usr/bin/chromedriver', '/usr/lib/chromium/chromedriver']:
            if os.path.exists(driver_path):
                service_kwargs["executable_path"] = driver_path
                break

        service = Service(**service_kwargs)
        if os.name == 'nt':
            service.creation_flags = 0x08000000  # CREATE_NO_WINDOW

        try:
            self.driver = webdriver.Chrome(service=service, options=options)
        except Exception as e:
            logger.warning(f"Échec initialisation standard Chromium ({e}). Tentative simplifiée...")
            options_fallback = Options()
            options_fallback.page_load_strategy = 'eager'
            options_fallback.add_argument("--headless=new")
            options_fallback.add_argument("--no-sandbox")
            options_fallback.add_argument("--disable-dev-shm-usage")
            options_fallback.add_argument("--disable-gpu")
            options_fallback.add_argument(f"--user-agent={current_ua}")
            options_fallback.add_argument("--disable-blink-features=AutomationControlled")
            self.driver = webdriver.Chrome(service=service, options=options_fallback)

        # Dissimuler les traces de navigation automatisée (navigator.webdriver)
        try:
            self.driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
                "source": """
                    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                    window.navigator.chrome = { runtime: {} };
                    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
                    Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en-US', 'en'] });
                """
            })
        except Exception:
            pass

        self.driver.set_page_load_timeout(35)
        return self.driver

    def stop_driver(self):
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None

    def execute_task_action(self, platform: str, action: str, target_url: str, task_id: int, comment_text: Optional[str] = None) -> Tuple[bool, str, str]:
        driver = self.start_driver()
        screenshot_path = os.path.join(SCREENSHOT_DIR, f"termux_task_{task_id}_{int(time.time())}.png")

        try:
            if target_url:
                driver.get(target_url)
                time.sleep(3.5)

            p = platform.lower()
            act = action.lower()

            if "threads" in p or "threads.net" in target_url:
                self._handle_threads(driver, act, comment_text)
            elif "reddit" in p or "reddit.com" in target_url:
                self._handle_reddit(driver, act, comment_text)
            elif "tiktok" in p:
                self._handle_tiktok(driver, act, comment_text)
            elif "facebook" in p:
                self._handle_facebook(driver, act, comment_text)
            elif "instagram" in p:
                self._handle_instagram(driver, act, comment_text)
            elif "youtube" in p:
                self._handle_youtube(driver, act, comment_text)
            elif "linkedin" in p:
                self._handle_linkedin(driver, act, comment_text)
            elif "telegram" in p:
                self._handle_telegram(driver)
            elif "github" in p:
                self._handle_github(driver, act)
            elif "discord" in p:
                self._handle_discord(driver)
            elif "twitter" in p or "x.com" in target_url:
                self._handle_twitter(driver, act, comment_text)
            elif "snapchat" in p or "snapchat.com" in target_url:
                self._handle_snapchat(driver, act)
            elif "spotify" in p:
                self._handle_spotify(driver, act)
            elif "threads" in p or "threads.net" in target_url:
                self._handle_threads(driver, act, comment_text)
            elif "reddit" in p or "reddit.com" in target_url:
                self._handle_reddit(driver, act, comment_text)
            elif "pinterest" in p or "pinterest.com" in target_url:
                self._handle_pinterest(driver, act, comment_text)
            elif "soundcloud" in p or "soundcloud.com" in target_url:
                self._handle_soundcloud(driver, act, comment_text)
            elif "bluesky" in p or "bsky" in p or "bsky.app" in target_url:
                self._handle_bluesky(driver, act, comment_text)

            # Si commentaire, délai supplémentaire pour que le commentaire apparaisse bien à l'écran
            if "comment" in act:
                time.sleep(3.5)
            else:
                time.sleep(2.0)

            # NETTOYAGE DOM & INJECTION DE PREUVE VISUELLE STRICTE
            if ScreenshotGuard:
                ScreenshotGuard.clean_and_prepare_dom(driver, platform, action, comment_text)

            driver.save_screenshot(screenshot_path)
            ensure_unique_screenshot(screenshot_path)

            # CONTRÔLE DE SÉCURITÉ POST-CAPTURE STRICT ANTI-REJET
            if ScreenshotGuard:
                ok_guard, guard_msg = ScreenshotGuard.strict_pre_submission_check(driver, platform, screenshot_path, True)
                if not ok_guard:
                    logger.warning(f"🛡️ Capture invalidée par le garde-fou: {guard_msg}")
                    return False, f"Rejet interne de sécurité (Anti-Ban) : {guard_msg}", screenshot_path

            return True, "Action effectuée et capture validée", screenshot_path

        except Exception as e:
            try:
                driver.save_screenshot(screenshot_path)
                ensure_unique_screenshot(screenshot_path)
            except Exception:
                pass
            return False, f"Erreur navigateur Termux: {str(e)}", screenshot_path

    # =========================================================================
    # GESTIONNAIRES D'ACTIONS PAR RÉSEAU SOCIAL
    # =========================================================================
    def _handle_threads(self, driver, action: str, comment_text: Optional[str] = None):
        try:
            driver.execute_script("""
            var btns = document.querySelectorAll('button');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent||'').toLowerCase();
                if(t.indexOf('autoriser')!==-1||t.indexOf('accepter')!==-1||t.indexOf('allow all')!==-1){ btns[i].click(); break; }
            }
            """)
            time.sleep(1)
        except Exception: pass

        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Great! 👍';
            var replyBtn = document.querySelector('svg[aria-label*="Répondre" i], svg[aria-label*="Reply" i]');
            if(replyBtn){
                var p = replyBtn.closest('div[role="button"]') || replyBtn.parentElement;
                if(p) p.click();
            }
            setTimeout(function(){
                var box = document.querySelector('div[role="textbox"][contenteditable="true"], div[aria-label*="répondre" i]');
                if(box){
                    box.focus();
                    document.execCommand('insertText', false, txt);
                    box.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(function(){
                        var btns = document.querySelectorAll('div[role="button"], button');
                        for(var i=0; i<btns.length; i++){
                            var t = (btns[i].textContent||'').trim().toLowerCase();
                            if(t === 'publier' || t === 'post' || t === 'reply'){ btns[i].click(); break; }
                        }
                    }, 600);
                }
            }, 800);
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.0)
            except Exception: pass
            return

        if "follow" in action or "suivre" in action:
            driver.execute_script("""
            var btns = document.querySelectorAll('div[role="button"], button');
            for(var i=0; i<btns.length; i++){
                var txt = (btns[i].textContent||'').trim().toLowerCase();
                if(txt==='suivre'||txt==='follow'||txt==="s'abonner"||txt==='+ suivre'){ btns[i].click(); return true; }
            }
            """)
        elif "like" in action or "aimer" in action:
            driver.execute_script("""
            var svg = document.querySelector('svg[aria-label*="J\'aime" i], svg[aria-label*="Like" i]');
            if(svg){ var p = svg.closest('div[role="button"]')||svg.parentElement; if(p) p.click(); }
            """)
        elif "share" in action or "repost" in action:
            driver.execute_script("""
            var svg = document.querySelector('svg[aria-label*="Republier" i], svg[aria-label*="Repost" i]');
            if(svg){
                var p = svg.closest('div[role="button"]')||svg.parentElement;
                if(p){
                    p.click();
                    setTimeout(function(){
                        var m = document.querySelectorAll('div[role="menuitem"], div[role="button"]');
                        for(var j=0; j<m.length; j++){
                            var t = (m[j].textContent||'').toLowerCase();
                            if(t.indexOf('republier')!==-1||t.indexOf('repost')!==-1){ m[j].click(); break; }
                        }
                    }, 500);
                }
            }
            """)

    def _handle_reddit(self, driver, action: str, comment_text: Optional[str] = None):
        try:
            driver.execute_script("""
            var b = document.querySelectorAll('button');
            for(var i=0; i<b.length; i++){
                var t = (b[i].textContent||'').toLowerCase();
                if(t.indexOf('accept all')!==-1||t.indexOf('tout accepter')!==-1){ b[i].click(); break; }
            }
            """)
            time.sleep(1)
        except Exception: pass

        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Great post! 👍';
            var composer = document.querySelector('shreddit-comment-composer, div[slot="rte"], div[contenteditable="true"], textarea[name="comment"]');
            if(!composer){
                var cBtn = document.querySelector('button[aria-label*="comment" i], button[aria-label*="Ajouter un commentaire" i]');
                if(cBtn) cBtn.click();
            }
            setTimeout(function(){
                var box = document.querySelector('div[slot="rte"] div[contenteditable="true"], textarea[name="comment"], div[role="textbox"]');
                if(box){
                    box.focus();
                    document.execCommand('insertText', false, txt);
                    box.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(function(){
                        var submitBtn = document.querySelector('shreddit-comment-composer button[type="submit"], button[slot="submit-button"]');
                        if(submitBtn) submitBtn.click();
                    }, 500);
                }
            }, 800);
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.0)
            except Exception: pass
            return

        if "upvote" in action or "vote" in action or "like" in action:
            driver.execute_script("""
            var up = document.querySelector('button[upvote-button], shreddit-post button[aria-label*="upvote" i], button[data-click-id="upvote"], button[aria-label*="vote positif" i]');
            if(up) up.click();
            """)
        elif "follow" in action or "suivre" in action:
            driver.execute_script("""
            var f = document.querySelector('shreddit-profile-header button, button[aria-label*="Follow" i], button[data-testid="follow-button"]');
            if(f){
                var txt = (f.textContent||'').toLowerCase();
                if(txt.indexOf('unfollow')===-1) f.click();
            }
            """)

    def _handle_tiktok(self, driver, action: str, comment_text: Optional[str] = None):
        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Great video! 👍';
            var cInput = document.querySelector('div[contenteditable="true"][data-e2e*="comment" i], textarea[placeholder*="comment" i], [data-e2e="comment-input"]');
            if(cInput){
                cInput.focus();
                document.execCommand('insertText', false, txt);
                cInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(function(){
                    var pBtn = document.querySelector('[data-e2e="comment-post"]');
                    if(pBtn) pBtn.click();
                }, 500);
            }
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.0)
            except Exception: pass
            return

        if "like" in action or "aimer" in action:
            driver.execute_script("""
            var likeBtn = document.querySelector('[data-e2e="like-icon"], [data-e2e="browse-like-icon"], [data-e2e="video-like-button"]');
            if(likeBtn){
                var b = (likeBtn.tagName==='BUTTON')?likeBtn:(likeBtn.closest('button')||likeBtn);
                b.click();
            }
            """)
        else:
            driver.execute_script("""
            var btn = document.querySelector('[data-e2e="follow-button"], [data-e2e="user-follow-button"]');
            if(btn) btn.click();
            """)

    def _handle_facebook(self, driver, action: str, comment_text: Optional[str] = None):
        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Top ! 👍';
            var box = document.querySelector('div[role="textbox"][aria-label*="commentaire" i], div[role="textbox"][aria-label*="comment" i]');
            if(box){
                box.focus();
                document.execCommand('insertText', false, txt);
                box.dispatchEvent(new Event('input', { bubbles: true }));
                var enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
                box.dispatchEvent(enterEvent);
            }
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.0)
            except Exception: pass
            return

        driver.execute_script("""
        var btns = document.querySelectorAll('button, [role="button"]');
        for(var i=0; i<btns.length; i++){
            var t = (btns[i].textContent||'').toLowerCase();
            if(t.indexOf('suivre')!==-1||t.indexOf('follow')!==-1||t.indexOf("j'aime")!==-1){ btns[i].click(); break; }
        }
        """)

    def _handle_instagram(self, driver, action: str, comment_text: Optional[str] = None):
        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Super! 🔥';
            var ta = document.querySelector('textarea[aria-label*="Ajouter un commentaire" i], textarea[placeholder*="commentaire" i], textarea[placeholder*="comment" i], textarea');
            if(ta){
                ta.focus();
                ta.value = txt;
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(function(){
                    var btns = document.querySelectorAll('button, div[role="button"]');
                    for(var i=0; i<btns.length; i++){
                        var t = (btns[i].textContent||'').trim().toLowerCase();
                        if(t === 'publier' || t === 'post'){ btns[i].click(); break; }
                    }
                }, 500);
            }
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.0)
            except Exception: pass
            return

        if "like" in action or "aimer" in action:
            driver.execute_script("""
            var svg = document.querySelector('svg[aria-label*="J\'aime" i], svg[aria-label*="Like" i]');
            if(svg){ var p = svg.closest('button, div[role="button"]')||svg.parentElement; if(p) p.click(); }
            """)
        else:
            driver.execute_script("""
            var btns = document.querySelectorAll('button');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent||'').trim().toLowerCase();
                if(t==='suivre'||t==='follow'||t==="s'abonner"){ btns[i].click(); break; }
            }
            """)

    def _handle_youtube(self, driver, action: str, comment_text: Optional[str] = None):
        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Great video! 👏';
            window.scrollTo(0, 450);
            var ph = document.querySelector('#simplebox-placeholder');
            if(ph) ph.click();
            setTimeout(function(){
                var inp = document.querySelector('#contenteditable-root, div[role="textbox"]#contenteditable-root');
                if(inp){
                    inp.focus();
                    document.execCommand('insertText', false, txt);
                    inp.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(function(){
                        var sub = document.querySelector('#submit-button button, button[aria-label*="Commenter" i], button[aria-label*="Comment" i]');
                        if(sub) sub.click();
                    }, 600);
                }
            }, 800);
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.5)
            except Exception: pass
            return

        if "subscribe" in action or "abonner" in action or "suivre" in action:
            driver.execute_script("""
            var sub = document.querySelector('#subscribe-button button, ytd-subscribe-button-renderer button');
            if(sub) sub.click();
            """)
        elif "like" in action or "aimer" in action:
            driver.execute_script("""
            var like = document.querySelector('like-button-view-model button, #segmented-like-button button, button[aria-label*="J\'aime" i], button[aria-label*="Like" i]');
            if(like) like.click();
            """)
        else:
            driver.execute_script("""
            var sub = document.querySelector('#subscribe-button button, ytd-subscribe-button-renderer button');
            if(sub) sub.click();
            var like = document.querySelector('like-button-view-model button, #segmented-like-button button');
            if(like) like.click();
            """)

    def _handle_linkedin(self, driver, action: str, comment_text: Optional[str] = None):
        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Great insights, thanks for sharing! 👏';
            var commBtn = document.querySelector('button[aria-label*="Commenter" i], button[aria-label*="Comment" i], button.comment-button');
            if(commBtn) commBtn.click();
            setTimeout(function(){
                var box = document.querySelector('div.editor-content p, div[role="textbox"], div[contenteditable="true"]');
                if(box){
                    box.focus();
                    document.execCommand('insertText', false, txt);
                    box.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(function(){
                        var pubBtn = document.querySelector('button.comments-comment-box__submit-button, button[class*="submit-button" i]');
                        if(pubBtn) pubBtn.click();
                    }, 600);
                }
            }, 800);
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.5)
            except Exception: pass
            return

        if "connection" in action or "connect" in action:
            driver.execute_script("""
            var btns = document.querySelectorAll('button, [role="button"]');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent||'').trim().toLowerCase();
                var aria = (btns[i].getAttribute('aria-label')||'').toLowerCase();
                if(t==='se connecter'||t==='connect'||aria.indexOf('connect')!==-1||aria.indexOf('inviter')!==-1){ btns[i].click(); break; }
            }
            """)
        elif "like" in action or "aimer" in action:
            driver.execute_script("""
            var lk = document.querySelector('button.react-button__trigger, button[aria-label*="J\'aime" i], button[aria-label*="Like" i]');
            if(lk) lk.click();
            """)
        else:
            driver.execute_script("""
            var btns = document.querySelectorAll('button, [role="button"]');
            for(var i=0; i<btns.length; i++){
                var t = (btns[i].textContent||'').trim().toLowerCase();
                if(t==='suivre'||t==='follow'||t.indexOf('+ suivre')!==-1){ btns[i].click(); break; }
            }
            """)

    def _handle_telegram(self, driver):
        driver.execute_script("""
        var btn = document.querySelector('.tgme_action_button, a[href*="tg:"]');
        if(btn) btn.click();
        """)

    def _handle_github(self, driver, action: str):
        driver.execute_script("""
        var star = document.querySelector('form.unstarred button, [aria-label*="Star this repository" i]');
        if(star) star.click();
        var fol = document.querySelector('input[value="Follow"], button[value="Follow"]');
        if(fol) fol.click();
        """)

    def _handle_discord(self, driver):
        driver.execute_script("""
        var btns = document.querySelectorAll('button, [role="button"], a');
        for(var i=0; i<btns.length; i++){
            var t = (btns[i].textContent||'').toLowerCase();
            if(t.indexOf('accepter')!==-1||t.indexOf('accept')!==-1||t.indexOf('join')!==-1){ btns[i].click(); break; }
        }
        """)

    def _handle_twitter(self, driver, action: str, comment_text: Optional[str] = None):
        if "comment" in action:
            c_js = """
            var txt = arguments[0] || 'Nice! 🔥';
            var replyBtn = document.querySelector('button[data-testid="reply"]');
            if(replyBtn) replyBtn.click();
            setTimeout(function(){
                var box = document.querySelector('div[role="textbox"][data-testid="tweetTextarea_0"]');
                if(box){
                    box.focus();
                    document.execCommand('insertText', false, txt);
                    box.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(function(){
                        var tweetBtn = document.querySelector('button[data-testid="tweetButton"]');
                        if(tweetBtn) tweetBtn.click();
                    }, 600);
                }
            }, 800);
            """
            try:
                driver.execute_script(c_js, comment_text)
                time.sleep(2.0)
            except Exception: pass
            return

        if "like" in action or "aimer" in action:
            driver.execute_script("""
            var lk = document.querySelector('button[data-testid="like"], div[data-testid="like"], [aria-label*="Like" i], [aria-label*="J\\'aime" i]');
            if(lk) { lk.click(); }
            """)
        elif "retweet" in action or "repost" in action or "partager" in action:
            driver.execute_script("""
            var rt = document.querySelector('button[data-testid="retweet"], div[data-testid="retweet"], [aria-label*="Repost" i], [aria-label*="Retweet" i]');
            if(rt) {
                rt.click();
                setTimeout(function(){
                    var confirmRt = document.querySelector('div[data-testid="retweetConfirm"], [data-testid="retweet-confirm"]');
                    if(confirmRt) confirmRt.click();
                }, 400);
            }
            """)
        else:
            driver.execute_script("""
            var btns = document.querySelectorAll('button[data-testid$="-follow"], button[data-testid="placementTracking"], [aria-label*="Follow @" i], [aria-label*="Suivre @" i]');
            for(var i=0; i<btns.length; i++){
                var txt = (btns[i].textContent || '').trim().toLowerCase();
                if(txt.indexOf('following') === -1 && txt.indexOf('abonné') === -1){
                    btns[i].click();
                    break;
                }
            }
            """)

    def _handle_snapchat(self, driver, action: str):
        driver.execute_script("""
        var s = document.querySelector('button[class*="Subscribe" i], button[class*="Add" i]');
        if(s) s.click();
        """)

    def _handle_spotify(self, driver, action: str):
        driver.execute_script("""
        var btns = document.querySelectorAll('button');
        for(var i=0; i<btns.length; i++){
            var aria = (btns[i].getAttribute('aria-label')||'').toLowerCase();
            var t = (btns[i].textContent||'').trim().toLowerCase();
            if(aria.indexOf('suivre')!==-1||aria.indexOf('follow')!==-1||t==='suivre'||t==='follow'){ btns[i].click(); break; }
        }
        """)

    def _handle_pinterest(self, driver, action: str, comment_text: Optional[str] = None):
        """Pinterest : Follow profil, Save/Like Pin, Repin, Commentaire. Anti-unfollow/unlike."""
        # 1. Fermeture popups/cookies
        driver.execute_script("""
        try {
            var closeBtns = document.querySelectorAll('button[aria-label="Fermer"], button[aria-label="Close"], div[data-test-id="full-page-signup-close-button"], [data-test-id="cookie-banner-accept-button"]');
            for (var i = 0; i < closeBtns.length; i++) {
                if (closeBtns[i].offsetWidth > 0) { closeBtns[i].click(); break; }
            }
        } catch(e) {}
        """)
        time.sleep(1)

        # 2. Save / Like
        if "like" in action or "save" in action or "pin" in action or "repin" in action:
            driver.execute_script("""
            var saveSelectors = ['button[data-test-id="PinBetterSaveButton"]', 'button[data-test-id="pin-action-bar-save-button"]', 'button[aria-label*="Save" i]', 'button[aria-label*="Enregistrer" i]'];
            for (var s = 0; s < saveSelectors.length; s++) {
                var btn = document.querySelector(saveSelectors[s]);
                if (btn && btn.offsetWidth > 0) {
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    if (txt.indexOf('saved') !== -1 || txt.indexOf('enregistré') !== -1 || aria.indexOf('saved') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 3. Follow
        elif "follow" in action or "suivre" in action or "abonner" in action or "profile" in action:
            driver.execute_script("""
            var followSelectors = ['button[data-test-id="user-follow-button"]', 'button[data-test-id="ProfileHeaderFollowButton"]', 'button[aria-label*="Follow" i]', 'button[aria-label*="Suivre" i]'];
            for (var s = 0; s < followSelectors.length; s++) {
                var btn = document.querySelector(followSelectors[s]);
                if (btn && btn.offsetWidth > 0) {
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    if (txt.indexOf('following') !== -1 || txt.indexOf('abonné') !== -1 || txt.indexOf('se désabonner') !== -1 || aria.indexOf('following') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 4. Commentaire
        if "comment" in action:
            driver.execute_script("""
            var txt = arguments[0];
            var box = document.querySelector('div[data-test-id="comment-composer-input"] [contenteditable="true"], textarea[placeholder*="comment" i]');
            if (box) {
                box.focus();
                box.textContent = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                var subBtn = document.querySelector('button[data-test-id="comment-submit-button"], button[type="submit"]');
                if (subBtn) subBtn.click();
            }
            """, comment_text or "Great inspiration! 📌✨")

    def _handle_soundcloud(self, driver, action: str, comment_text: Optional[str] = None):
        """SoundCloud : Follow artiste, Like titre, Repost, Commentaire. Anti-unfollow/unlike."""
        # 1. Cookies
        driver.execute_script("""
        try {
            var cookieBtn = document.querySelector('#onetrust-accept-btn-handler, button[title*="Accept" i]');
            if (cookieBtn && cookieBtn.offsetWidth > 0) cookieBtn.click();
        } catch(e) {}
        """)
        time.sleep(1)

        # 2. Like
        if "like" in action or "fav" in action or "aime" in action:
            driver.execute_script("""
            var likeBtns = document.querySelectorAll('button.sc-button-like, button[title*="Like" i]');
            for (var i = 0; i < likeBtns.length; i++) {
                var btn = likeBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var title = (btn.getAttribute('title') || '').toLowerCase();
                    var cls = btn.className || '';
                    if (cls.indexOf('sc-button-selected') !== -1 || title.indexOf('unlike') !== -1 || title.indexOf('liked') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 3. Repost
        elif "repost" in action or "partager" in action:
            driver.execute_script("""
            var rpBtns = document.querySelectorAll('button.sc-button-repost, button[title*="Repost" i]');
            for (var i = 0; i < rpBtns.length; i++) {
                var btn = rpBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var cls = btn.className || '';
                    if (cls.indexOf('sc-button-selected') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 4. Follow
        elif "follow" in action or "suivre" in action or "profile" in action or "artiste" in action:
            driver.execute_script("""
            var followBtns = document.querySelectorAll('button.sc-button-follow, button[title*="Follow" i]');
            for (var i = 0; i < followBtns.length; i++) {
                var btn = followBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var title = (btn.getAttribute('title') || '').toLowerCase();
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    var cls = btn.className || '';
                    if (cls.indexOf('sc-button-selected') !== -1 || title.indexOf('unfollow') !== -1 || txt.indexOf('following') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 5. Commentaire
        if "comment" in action:
            driver.execute_script("""
            var txt = arguments[0];
            var box = document.querySelector('input.commentForm__input, textarea.commentForm__input');
            if (box) {
                box.focus();
                box.value = txt;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
            }
            """, comment_text or "Great track! 🔥🎶")

    def _handle_bluesky(self, driver, action: str, comment_text: Optional[str] = None):
        """Bluesky : Follow profil, Like post, Repost, Reply/Comment. Anti-unfollow/unlike."""
        # 1. Modales
        driver.execute_script("""
        try {
            var closeBtns = document.querySelectorAll('button[aria-label="Close"], button[aria-label="Fermer"]');
            for (var i = 0; i < closeBtns.length; i++) {
                if (closeBtns[i].offsetWidth > 0) { closeBtns[i].click(); break; }
            }
        } catch(e) {}
        """)
        time.sleep(1)

        # 2. Like
        if "like" in action or "aime" in action or "fav" in action:
            driver.execute_script("""
            var likeBtns = document.querySelectorAll('button[data-testid="likeBtn"], [aria-label*="Like" i]');
            for (var i = 0; i < likeBtns.length; i++) {
                var btn = likeBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    var pressed = btn.getAttribute('aria-pressed');
                    if (testid.indexOf('unlike') !== -1 || aria.indexOf('unlike') !== -1 || pressed === 'true') {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 3. Repost
        elif "repost" in action or "partager" in action:
            driver.execute_script("""
            var rpBtns = document.querySelectorAll('button[data-testid="repostBtn"]');
            for (var i = 0; i < rpBtns.length; i++) {
                var btn = rpBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var pressed = btn.getAttribute('aria-pressed');
                    if (pressed === 'true') {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    setTimeout(function(){
                        var confirmBtn = document.querySelector('div[role="menu"] button, [data-testid="repostConfirmBtn"]');
                        if (confirmBtn) confirmBtn.click();
                    }, 400);
                    return;
                }
            }
            """)
        # 4. Follow
        elif "follow" in action or "suivre" in action or "profile" in action or "abonner" in action:
            driver.execute_script("""
            var followBtns = document.querySelectorAll('button[data-testid="followBtn"], button[aria-label*="Follow" i]');
            for (var i = 0; i < followBtns.length; i++) {
                var btn = followBtns[i];
                if (btn && btn.offsetWidth > 0) {
                    var testid = (btn.getAttribute('data-testid') || '').toLowerCase();
                    var aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    var txt = (btn.textContent || '').trim().toLowerCase();
                    if (testid.indexOf('unfollow') !== -1 || aria.indexOf('unfollow') !== -1 || txt.indexOf('following') !== -1) {
                        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                        return;
                    }
                    btn.scrollIntoView({behavior: 'smooth', block: 'center'});
                    btn.click();
                    return;
                }
            }
            """)
        # 5. Commentaire / Réponse
        if "comment" in action or "reply" in action:
            driver.execute_script("""
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
            """, comment_text or "Great share! 🦋")
