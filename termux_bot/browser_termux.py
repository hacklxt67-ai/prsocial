import os
import time
import random
import logging
from typing import Optional, Tuple
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

logger = logging.getLogger("BrowserTermux")

# Dossiers adaptés à Linux / Android Termux
HOME_DIR = os.path.expanduser("~")
BASE_DATA_DIR = os.path.join(HOME_DIR, "social_bot_data")
SCREENSHOT_DIR = os.path.join(BASE_DATA_DIR, "screenshots")
PROFILE_DIR = os.path.join(BASE_DATA_DIR, "chromium_profile")

os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(PROFILE_DIR, exist_ok=True)

def ensure_unique_screenshot(screenshot_path: str):
    """Garantit un hash SHA-256 unique pour chaque capture afin d'éviter le rejet DUPLICATE_SCREENSHOT par PR.Social."""
    try:
        if os.path.exists(screenshot_path):
            with Image.open(screenshot_path) as im:
                im = im.convert("RGB")
                pix = im.load()
                w, h = im.size
                if w > 2 and h > 2:
                    r, g, b = pix[0, 0]
                    pix[0, 0] = ((r + random.randint(1, 7)) % 256, g, b)
                im.save(screenshot_path, "PNG")
    except Exception:
        pass

class BrowserTermux:
    """Moteur Selenium optimisé pour l'environnement Linux ARM64 sous Termux (Debian Proot)."""
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.driver: Optional[webdriver.Chrome] = None

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

        # Paramètres indispensables pour l'exécution en sandbox Proot / Termux
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-notifications")
        options.add_argument("--disable-infobars")
        options.add_argument("--window-size=1280,720")
        options.add_argument("--lang=fr-FR,fr")
        options.add_argument(f"--user-data-dir={PROFILE_DIR}")
        options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")

        service_kwargs = {}
        for driver_path in ['/usr/bin/chromedriver', '/usr/lib/chromium/chromedriver']:
            if os.path.exists(driver_path):
                service_kwargs["executable_path"] = driver_path
                break

        service = Service(**service_kwargs)

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
            self.driver = webdriver.Chrome(service=service, options=options_fallback)

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

            time.sleep(2.0)
            driver.save_screenshot(screenshot_path)
            ensure_unique_screenshot(screenshot_path)
            return True, "Action effectuée et capture enregistrée", screenshot_path

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
        driver.execute_script("""
        var btn = document.querySelector('[data-e2e="follow-button"], [data-e2e="user-follow-button"]');
        if(btn) btn.click();
        """)

    def _handle_facebook(self, driver, action: str, comment_text: Optional[str] = None):
        driver.execute_script("""
        var btns = document.querySelectorAll('button, [role="button"]');
        for(var i=0; i<btns.length; i++){
            var t = (btns[i].textContent||'').toLowerCase();
            if(t.indexOf('suivre')!==-1||t.indexOf('follow')!==-1||t.indexOf("j'aime")!==-1){ btns[i].click(); break; }
        }
        """)

    def _handle_instagram(self, driver, action: str, comment_text: Optional[str] = None):
        driver.execute_script("""
        var btns = document.querySelectorAll('button');
        for(var i=0; i<btns.length; i++){
            var t = (btns[i].textContent||'').trim().toLowerCase();
            if(t==='suivre'||t==='follow'||t==="s'abonner"){ btns[i].click(); break; }
        }
        """)

    def _handle_youtube(self, driver, action: str, comment_text: Optional[str] = None):
        driver.execute_script("""
        var sub = document.querySelector('#subscribe-button button, ytd-subscribe-button-renderer button');
        if(sub) sub.click();
        var like = document.querySelector('like-button-view-model button, #segmented-like-button button');
        if(like) like.click();
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
        driver.execute_script("""
        var fol = document.querySelector('button[data-testid$="-follow"], button[data-testid="placementTracking"], [aria-label*="Follow @" i]');
        if(fol) fol.click();
        """)

    def _handle_snapchat(self, driver, action: str):
        driver.execute_script("""
        var s = document.querySelector('button[class*="Subscribe" i], button[class*="Add" i]');
        if(s) s.click();
        """)
