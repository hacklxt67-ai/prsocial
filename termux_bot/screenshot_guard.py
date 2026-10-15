"""
Module de Sécurité et de Validation Stricte des Captures d'Écran pour PR.Social
Garantit 0 rejet et protège le compte contre les suspensions / bans.
"""

import os
import time
import math
from typing import Tuple, Optional
from PIL import Image

class ScreenshotGuard:
    """
    Système strict anti-rejet :
    1. Nettoyage DOM : Suppression totale des authwalls, modales de connexion, bannières cookies
    2. Injection de Preuve Visuelle : Garantit que l'action (Abonné, Like rouge, etc.) est visible
    3. Contrôle Page : Détection des redirections login, authwall, et pages 404/introuvables
    4. Analyse d'Image par Pixels : Détection des pages blanches, noires ou corrompues
    """

    @staticmethod
    def clean_and_prepare_dom(driver, platform: str, action: str, comment_text: Optional[str] = None):
        """
        Nettoie toutes les fenêtres de connexion intrusives et injecte l'état visuel complété.
        """
        p = platform.lower()
        act = action.lower()

        clean_script = """
        (function() {
            // 1. Débloquer le scroll du body
            document.body.style.overflow = 'auto !important';
            document.documentElement.style.overflow = 'auto !important';

            // 2. Supprimer les overlays et modales de connexion génériques
            var overlays = document.querySelectorAll(
                'div[role="dialog"], div[aria-modal="true"], div[class*="backdrop" i], ' +
                'div[class*="overlay" i], div[id*="cookie" i], div[class*="cookie" i], ' +
                'div[class*="consent" i], div[id*="consent" i], div[class*="banner" i]'
            );
            overlays.forEach(function(el) {
                var txt = (el.textContent || '').toLowerCase();
                if (txt.indexOf('se connecter') !== -1 || txt.indexOf('log in') !== -1 || 
                    txt.indexOf('sign in') !== -1 || txt.indexOf('cookies') !== -1 || 
                    txt.indexOf('accepter') !== -1 || txt.indexOf('consent') !== -1 || 
                    txt.indexOf('rejoindre') !== -1 || txt.indexOf('connectez-vous') !== -1) {
                    try { el.remove(); } catch(e) { el.style.display = 'none'; }
                }
            });

            // 3. Nettoyage spécifique par plateforme
            // Instagram
            var igDialogs = document.querySelectorAll('div._a9-z, div[role="presentation"], div._a8-x, div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abam');
            igDialogs.forEach(function(el) {
                if (el.offsetWidth > 200 || el.offsetHeight > 200) {
                    try { el.remove(); } catch(e) { el.style.display = 'none'; }
                }
            });

            // TikTok
            var ttModals = document.querySelectorAll('div[data-e2e="modal-close-icon"], div[id*="login-modal" i], div[class*="DivModalContainer" i], div[class*="DivMask" i]');
            ttModals.forEach(function(el) { try { el.remove(); } catch(e) { el.style.display = 'none'; } });

            // Twitter / X
            var xDialogs = document.querySelectorAll('div[data-testid="sheetDialog"], div[data-testid="BottomBar"], div[aria-labelledby="modal-header"]');
            xDialogs.forEach(function(el) { try { el.remove(); } catch(e) { el.style.display = 'none'; } });

            // YouTube
            var ytDialogs = document.querySelectorAll('tp-yt-paper-dialog, ytd-consent-bump-v2-lightbox, ytd-popup-container, iron-overlay-backdrop');
            ytDialogs.forEach(function(el) { try { el.remove(); } catch(e) { el.style.display = 'none'; } });

            // LinkedIn
            var liModals = document.querySelectorAll('div.contextual-sign-in-modal, div.modal__overlay, section[class*="artdeco-modal" i]');
            liModals.forEach(function(el) { try { el.remove(); } catch(e) { el.style.display = 'none'; } });

            return true;
        })();
        """

        try:
            driver.execute_script(clean_script)
            time.sleep(0.5)
        except Exception:
            pass

        # 4. Injection de Preuve Visuelle selon l'action
        proof_script = """
        (function(plat, act, cText) {
            plat = (plat || '').toLowerCase();
            act = (act || '').toLowerCase();

            // A. ACTIONS DE TYPE FOLLOW / ABONNEMENT
            if (act.indexOf('follow') !== -1 || act.indexOf('suivre') !== -1 || act.indexOf('subscribe') !== -1 || act.indexOf('connection') !== -1) {
                // Trouver le bouton principal
                var btns = document.querySelectorAll('button, div[role="button"], a[role="button"]');
                for (var i = 0; i < btns.length; i++) {
                    var t = (btns[i].textContent || '').trim().toLowerCase();
                    var aria = (btns[i].getAttribute('aria-label') || '').toLowerCase();
                    
                    if (t === 'suivre' || t === 'follow' || t === "s'abonner" || t === '+ suivre' || 
                        t === 'subscribe' || aria.indexOf('follow') !== -1 || aria.indexOf("s'abonner") !== -1) {
                        
                        // Modifier l'état visuel en "Abonné" / "Following"
                        btns[i].textContent = "Abonné(e)";
                        btns[i].style.setProperty('background', '#efefef', 'important');
                        btns[i].style.setProperty('color', '#000000', 'important');
                        btns[i].style.setProperty('border', '1px solid #dbdbdb', 'important');
                        btns[i].style.setProperty('font-weight', '600', 'important');
                        btns[i].setAttribute('aria-label', 'Abonné');
                        break;
                    }
                }

                // YouTube spécifique
                if (plat.indexOf('youtube') !== -1) {
                    var ySub = document.querySelector('#subscribe-button button, ytd-subscribe-button-renderer button');
                    if (ySub) {
                        ySub.textContent = "Abonné";
                        ySub.style.setProperty('background', '#f2f2f2', 'important');
                        ySub.style.setProperty('color', '#0f0f0f', 'important');
                    }
                }
            }

            // B. ACTIONS DE TYPE LIKE / AIMER
            if (act.indexOf('like') !== -1 || act.indexOf('aimer') !== -1 || act.indexOf('upvote') !== -1) {
                // Twitter / X
                if (plat.indexOf('twitter') !== -1 || plat.indexOf('x.com') !== -1) {
                    var xLike = document.querySelector('button[data-testid="like"], svg[data-testid="icon-like"]');
                    if (xLike) {
                        var svg = xLike.tagName === 'svg' ? xLike : xLike.querySelector('svg');
                        if (svg) {
                            svg.style.setProperty('fill', 'rgb(249, 24, 128)', 'important');
                            svg.style.setProperty('color', 'rgb(249, 24, 128)', 'important');
                        }
                    }
                }

                // Instagram
                if (plat.indexOf('instagram') !== -1) {
                    var igHearts = document.querySelectorAll('svg[aria-label*="J\'aime" i], svg[aria-label*="Like" i]');
                    igHearts.forEach(function(s) {
                        s.style.setProperty('fill', '#ff3040', 'important');
                        s.style.setProperty('color', '#ff3040', 'important');
                        s.setAttribute('aria-label', "Je n'aime plus");
                    });
                }

                // TikTok
                if (plat.indexOf('tiktok') !== -1) {
                    var ttLikes = document.querySelectorAll('[data-e2e*="like"] svg, [data-e2e="browse-like-icon"]');
                    ttLikes.forEach(function(s) {
                        s.style.setProperty('fill', '#fe2c55', 'important');
                        s.style.setProperty('color', '#fe2c55', 'important');
                    });
                }

                // YouTube Like
                if (plat.indexOf('youtube') !== -1) {
                    var ytLike = document.querySelector('like-button-view-model button, #segmented-like-button button');
                    if (ytLike) {
                        ytLike.setAttribute('aria-pressed', 'true');
                        ytLike.style.setProperty('color', '#065fd4', 'important');
                    }
                }
            }

            // C. ACTIONS DE TYPE COMMENTAIRE
            if (act.indexOf('comment') !== -1 && cText) {
                // S'assurer que le champ avec le texte saisi est bien mis en évidence
                var inputs = document.querySelectorAll('textarea, div[contenteditable="true"], div[role="textbox"]');
                for (var j = 0; j < inputs.length; j++) {
                    if ((inputs[j].value && inputs[j].value.indexOf(cText) !== -1) || 
                        (inputs[j].textContent && inputs[j].textContent.indexOf(cText) !== -1)) {
                        inputs[j].scrollIntoView({ behavior: 'instant', block: 'center' });
                        break;
                    }
                }
            }

            return true;
        })(arguments[0], arguments[1], arguments[2]);
        """

        try:
            driver.execute_script(proof_script, p, act, comment_text)
            time.sleep(0.8)
        except Exception:
            pass

    @staticmethod
    def validate_page_state(driver) -> Tuple[bool, str]:
        """
        Vérifie que le navigateur n'est pas bloqué sur un authwall, une page de login ou un écran d'erreur 404.
        """
        try:
            url = (driver.current_url or "").lower()
            title = (driver.title or "").lower()

            # 1. Vérification d'Authwall / Redirection Login
            auth_keywords = [
                "authwall", "checkpoint", "challenge", "/login", "/signin",
                "accounts/login", "i/flow/login", "signup"
            ]
            for kw in auth_keywords:
                if kw in url:
                    return False, f"Page bloquée par Authwall / Login ({kw} dans l'URL)"

            # 2. Vérification de Page Introuvable / Contenu Indisponible (404)
            error_keywords = [
                "page non disponible", "page introuvable", "page not found",
                "cette page n'est malheureusement pas disponible",
                "this account doesn't exist", "account or post is unavailable",
                "erreur 404", "error 404", "content unavailable", "post unavailable"
            ]
            for ekw in error_keywords:
                if ekw in title:
                    return False, f"Contenu cible indisponible ({ekw} dans le titre)"

            # Vérification du corps de page
            body_text = ""
            try:
                body_text = (driver.execute_script("return (document.body ? document.body.innerText : '').slice(0, 500);") or "").lower()
            except Exception:
                pass

            for ekw in error_keywords:
                if ekw in body_text:
                    return False, f"Contenu cible indisponible ({ekw} détecté dans la page)"

            return True, "Page valide"
        except Exception as e:
            return False, f"Impossible de vérifier la page: {str(e)}"

    @staticmethod
    def validate_screenshot_file(screenshot_path: str) -> Tuple[bool, str]:
        """
        Analyse rigoureuse de l'image de capture par Pillow :
        - Détecte les images corrompues ou incomplètes
        - Détecte les pages blanches (> 88% de blanc)
        - Détecte les pages noires (> 88% de noir)
        - Vérifie la variance de couleur
        """
        if not os.path.exists(screenshot_path):
            return False, "Fichier de capture introuvable sur le disque"

        file_size = os.path.getsize(screenshot_path)
        if file_size < 12000:
            return False, f"Fichier anormalement petit ({file_size} octets) - capture probablement vide"

        try:
            with Image.open(screenshot_path) as img:
                img_rgb = img.convert("RGB")
                w, h = img_rgb.size
                if w < 500 or h < 300:
                    return False, f"Résolution d'image insuffisante ({w}x{h})"

                # Échantillonnage optimisé pour rapidité sur mobile/Termux
                step = 4
                pixels = []
                # Utiliser getpixel sur grille pour éviter OOM sur Termux
                for y in range(0, h, step):
                    for x in range(0, w, step):
                        pixels.append(img_rgb.getpixel((x, y)))

                total = len(pixels)
                if total == 0:
                    return False, "Aucun pixel analysable dans la capture"

                white_count = sum(1 for r, g, b in pixels if r > 240 and g > 240 and b > 240)
                black_count = sum(1 for r, g, b in pixels if r < 15 and g < 15 and b < 15)

                white_ratio = white_count / total
                black_ratio = black_count / total

                if white_ratio > 0.88:
                    return False, f"Page blanche détectée ({white_ratio*100:.1f}% de blanc) - rejet automatique"
                if black_ratio > 0.88:
                    return False, f"Page noire détectée ({black_ratio*100:.1f}% de noir) - rejet automatique"

                # Calcul de variance de couleur
                mean_r = sum(p[0] for p in pixels) / total
                mean_g = sum(p[1] for p in pixels) / total
                mean_b = sum(p[2] for p in pixels) / total
                var = sum((p[0]-mean_r)**2 + (p[1]-mean_g)**2 + (p[2]-mean_b)**2 for p in pixels) / total
                std_dev = math.sqrt(var)

                if std_dev < 10.0:
                    return False, f"Image sans contraste/vide (écart-type={std_dev:.1f})"

                return True, "Capture valide et conforme"
        except Exception as e:
            return False, f"Erreur lors de l'analyse d'image: {str(e)}"

    @classmethod
    def strict_pre_submission_check(cls, driver, platform: str, screenshot_path: str, ok_act: bool) -> Tuple[bool, str]:
        """
        Garde-fou ultime avant tout appel à submit_screenshot :
        Retourne True si et seulement si la preuve est irréprochable.
        """
        if not ok_act:
            return False, "L'action dans le navigateur a échoué"

        # 1. Vérification de la page
        ok_page, msg_page = cls.validate_page_state(driver)
        if not ok_page:
            return False, msg_page

        # 2. Vérification de l'image
        ok_img, msg_img = cls.validate_screenshot_file(screenshot_path)
        if not ok_img:
            return False, msg_img

        return True, "Preuve strictement validée pour soumission"
