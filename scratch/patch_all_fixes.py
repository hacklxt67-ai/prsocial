import re
import os

print("=== APPLYING ALL FIXES TO APK_MOD_SOCIAL_1.2.0 ===")

# ==============================================================================
# 1. TIKTOK ACTION CLIENT (Enhanced click + popup dismiss + selectors)
# ==============================================================================
tt_file = r'apk_mod_social_1.2.0/smali/com/prsocial/app/TikTokActionClient.smali'
with open(tt_file, 'r', encoding='utf-8') as f:
    tt_content = f.read()

# Replace simulateClickJS
old_sim_pat = r'(\.method public static simulateClickJS\(Ljava/lang/String;\)Ljava/lang/String;.*?)(\.end method)'
new_sim = '''.method public static simulateClickJS(Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "try{var __el=("

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, ");if(__el){try{var __r=__el.getBoundingClientRect();var __cx=__r.left+__r.width/2;var __cy=__r.top+__r.height/2;var __po=function(t,pt){return new PointerEvent(t,{bubbles:true,cancelable:true,view:window,clientX:__cx,clientY:__cy,screenX:__cx,screenY:__cy,pointerId:1,pointerType:pt||\\'touch\\',isPrimary:true});};var __mo=function(t){return new MouseEvent(t,{bubbles:true,cancelable:true,view:window,clientX:__cx,clientY:__cy,screenX:__cx,screenY:__cy});};__el.dispatchEvent(__po(\\'pointerover\\',\\'mouse\\'));__el.dispatchEvent(__mo(\\'mouseover\\'));__el.dispatchEvent(__po(\\'pointerdown\\',\\'touch\\'));__el.dispatchEvent(__mo(\\'mousedown\\'));__el.dispatchEvent(__po(\\'pointerup\\',\\'touch\\'));__el.dispatchEvent(__mo(\\'mouseup\\'));__el.dispatchEvent(__mo(\\'click\\'));}catch(e){}try{if(typeof __el.click===\\'function\\'){__el.click();}}catch(e){}}}catch(e){}"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method'''

tt_content = re.sub(old_sim_pat, new_sim, tt_content, flags=re.DOTALL)

# In buildClickFollowJS and buildWaitForFollowButtonJS:
# Add banner dismiss + robust follow selectors
new_follow_script_prefix = 'try{var __cb=document.querySelectorAll(\\'[data-e2e=\"modal-close-icon\"],[aria-label=\"Close\"],[aria-label=\"Fermer\"],button[class*=\"close\" i],div[class*=\"close\" i]\\');for(var __ci=0;__ci<__cb.length;__ci++){var __cr=__cb[__ci].getBoundingClientRect();if(__cr.width>0&&__cr.height>0){__cb[__ci].click();}}}catch(e){}var followBtn=null;var e2eList=[\\'button[data-e2e*=\"follow\"]\\',\\'[data-e2e*=\"follow\"]\\',\\'[data-e2e=\"follow-button\"]\\',\\'[data-e2e=\"user-follow-button\"]\\',\\'[data-e2e=\"profile-follow-btn\"]\\',\\'[data-e2e=\"profile-action-item-follow\"]\\',\\'[data-e2e=\"video-author-follow\"]\\',\\'[data-e2e=\"browse-follow-button\"]\\',\\'[data-e2e=\"follow-button-click\"]\\',\\'[data-e2e=\"user-page-follow-button\"]\\',\\'[data-e2e=\"profile-follow\"]\\',\\'[data-e2e=\"follow\"]\\'];for(var i=0;i<e2eList.length;i++){var el=document.querySelector(e2eList[i]);if(el){followBtn=(el.tagName===\\'BUTTON\\')?el:(el.querySelector(\\'button\\')||el.closest(\\'button\\')||el);break;}}if(!followBtn){var toFollowTxts=[\\'suivre\\',\\'follow\\',\\'abonner\\',\"s\\'abonner\",\\'关注\\',\\'subscribe\\',\"s\\'abonner en retour\",\\'suivre en retour\\',\\'follow back\\'];var ab=document.querySelectorAll(\\'button,[role=\"button\"],a,div[class*=\"follow\" i],div[class*=\"Follow\" i]\\');for(var b=0;b<ab.length;b++){var rc=ab[b].getBoundingClientRect();if(rc.width===0||rc.height===0)continue;var txt=(ab[b].textContent||ab[b].innerText||\\'\\').trim().toLowerCase();for(var t=0;t<toFollowTxts.length;t++){if(txt.indexOf(toFollowTxts[t])!==-1){followBtn=(ab[b].tagName===\\'BUTTON\\')?ab[b]:(ab[b].closest(\\'button\\')||ab[b]);break;}}if(followBtn)break;}}if(!followBtn){var ab3=document.querySelectorAll(\\'button,[role=\"button\"],a\\');for(var b3=0;b3<ab3.length;b3++){var lbl3=(ab3[b3].getAttribute(\\'aria-label\\')||\\'\\').toLowerCase();if(lbl3.indexOf(\\'follow\\')!==-1||lbl3.indexOf(\\'suivre\\')!==-1||lbl3.indexOf(\\'abonner\\')!==-1){var rc3=ab3[b3].getBoundingClientRect();if(rc3.width>0&&rc3.height>0){followBtn=(ab3[b3].tagName===\\'BUTTON\\')?ab3[b3]:(ab3[b3].closest(\\'button\\')||ab3[b3]);break;}}}}if(!followBtn){var debug=[];var dbab=document.querySelectorAll(\\'button,[role=\"button\"]\\');for(var d=0;d<dbab.length&&d<25;d++){var drc=dbab[d].getBoundingClientRect();if(drc.width===0||drc.height===0)continue;var dtxt=(dbab[d].textContent||\\'\\').trim().substring(0,20);var de2e=dbab[d].getAttribute(\\'data-e2e\\')||\\'\\';debug.push((de2e?\\'[\u0027+de2e+\u0027]\\':\\'\\')+dtxt);}alert(\\'TGAPP|not_found|\\'+debug.join(\u0027;;;\u0027));} else {var btnTxt=(followBtn.textContent||followBtn.innerText||\\'\\').trim().toLowerCase();var ariaLbl=(followBtn.getAttribute(\\'aria-label\\')||\\'\\').toLowerCase();var ap=followBtn.getAttribute(\\'aria-pressed\\');var cls=(followBtn.getAttribute(\\'class\\')||\\'\\').toLowerCase();var alreadyList=[\\'suivi\\',\\'following\\',\\'amis\\',\\'friends\\',\\'abonn\u00e9\\',\\'abonne\\',\\'unfollow\\',\\'ne plus suivre\\',\\'\u5df2\u5173\u6ce8\\',\\'\u5173\u6ce8\u4e2d\\',\\'\u4e92\u76f8\u5173\u6ce8\\',\\'\u597d\u53cb\\'];var isFollowing=ap===\\'true\\'||cls.indexOf(\\'following\\')!==-1;for(var al=0;al<alreadyList.length;al++){if(btnTxt===alreadyList[al]||btnTxt.indexOf(alreadyList[al])!==-1||ariaLbl.indexOf(alreadyList[al])!==-1){isFollowing=true;break;}}if(isFollowing){alert(\\'TGAPP|already_following|\\'+btnTxt);} else {'

# Update in buildClickFollowJS
tt_content = re.sub(r'const-string v2, "var followBtn=null;var e2eList=.*?else\{"', 'const-string v2, "' + new_follow_script_prefix + '"', tt_content, flags=re.DOTALL)

with open(tt_file, 'w', encoding='utf-8') as f:
    f.write(tt_content)
print("[1] TikTokActionClient.smali patched successfully.")

# ==============================================================================
# 2. TASK WEB VIEW ACTIVITY (Fix not_found retry + Fix screenshot ENOENT + Facebook support)
# ==============================================================================
twa_file = r'apk_mod_social_1.2.0/smali/com/prsocial/app/TaskWebViewActivity.smali'
with open(twa_file, 'r', encoding='utf-8') as f:
    twa_content = f.read()

# Fix A: in handleTikTokFollowResult, :pswitch_1 (not_found):
# Instead of immediately reporting task, check tikTokActionAttempts < 5 and retry with delay 1500ms
old_pswitch1 = ''':pswitch_1
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1072
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1073
    const-string p1, "Cible introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1074
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_2'''

new_pswitch1 = ''':pswitch_1
    iget p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    const/4 v0, 0x5

    if-ge p1, v0, :cond_tt_abort

    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda26;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda26;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x5dc

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    :cond_tt_abort
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1072
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1073
    const-string p1, "Cible introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1074
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_2'''

assert old_pswitch1 in twa_content, "old_pswitch1 not found"
twa_content = twa_content.replace(old_pswitch1, new_pswitch1, 1)

# Fix B: in onDestroy, remove premature selectedImage.delete() (prevents ENOENT race condition)
old_destroy_del = '''    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-eqz v0, :cond_2

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v0

    if-eqz v0, :cond_2

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    invoke-virtual {v0}, Ljava/io/File;->delete()Z

    .line 1740
    :cond_2'''

new_destroy_del = '''    :cond_1
    # Preserved file: deleted by ApiClient.submitScreenshot callback upon upload completion
    :cond_2'''

assert old_destroy_del in twa_content, "old_destroy_del not found"
twa_content = twa_content.replace(old_destroy_del, new_destroy_del, 1)

# Fix C: in onPageLoadedForAutoSubmit, if platform is facebook, trigger autoCaptureAndSubmit instead of performActionViaHttp
old_action_branch = '''    :cond_3
    :goto_0
    const-string v0, "tiktok"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4'''

new_action_branch = '''    :cond_3
    :goto_0
    const-string v0, "facebook"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_check_tt

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void

    :cond_check_tt
    const-string v0, "tiktok"

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4'''

assert old_action_branch in twa_content, "old_action_branch not found"
twa_content = twa_content.replace(old_action_branch, new_action_branch, 1)

with open(twa_file, 'w', encoding='utf-8') as f:
    f.write(twa_content)
print("[2] TaskWebViewActivity.smali patched successfully.")

# ==============================================================================
# 3. INSTAGRAM ACTION CLIENT (Align User-Agent + followRedirects(false) + FAILED state)
# ==============================================================================
ig_file = r'apk_mod_social_1.2.0/smali/com/prsocial/app/InstagramActionClient.smali'
with open(ig_file, 'r', encoding='utf-8') as f:
    ig_content = f.read()

# Fix A: User-Agent alignment
ig_content = ig_content.replace(
    'Mozilla/5.0 (Linux; Android 11; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
)

# Fix B: followRedirects(false) on OkHttpClient in <init>
old_okhttp_init = '''    invoke-virtual {v0}, Lokhttp3/OkHttpClient$Builder;->build()Lokhttp3/OkHttpClient;

    move-result-object v0

    iput-object v0, p0, Lcom/prsocial/app/InstagramActionClient;->client:Lokhttp3/OkHttpClient;'''

new_okhttp_init = '''    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Lokhttp3/OkHttpClient$Builder;->followRedirects(Z)Lokhttp3/OkHttpClient$Builder;

    move-result-object v0

    invoke-virtual {v0, v1}, Lokhttp3/OkHttpClient$Builder;->followSslRedirects(Z)Lokhttp3/OkHttpClient$Builder;

    move-result-object v0

    invoke-virtual {v0}, Lokhttp3/OkHttpClient$Builder;->build()Lokhttp3/OkHttpClient;

    move-result-object v0

    iput-object v0, p0, Lcom/prsocial/app/InstagramActionClient;->client:Lokhttp3/OkHttpClient;'''

assert old_okhttp_init in ig_content, "old_okhttp_init not found"
ig_content = ig_content.replace(old_okhttp_init, new_okhttp_init, 1)

# Fix C: in interpret, if html and not-logged-in (from 302 redirect), return state "FAILED" instead of "NOT_LOGGED_IN"
# This avoids shutting down and locking the Instagram automation
old_ig_not_logged = '''    const-string p1, "NOT_LOGGED_IN"

    if-eqz v1, :cond_4

    if-eqz v2, :cond_4'''

new_ig_not_logged = '''    const-string p1, "FAILED"

    if-eqz v1, :cond_4

    if-eqz v2, :cond_4'''

assert old_ig_not_logged in ig_content, "old_ig_not_logged not found"
ig_content = ig_content.replace(old_ig_not_logged, new_ig_not_logged, 1)

with open(ig_file, 'w', encoding='utf-8') as f:
    f.write(ig_content)
print("[3] InstagramActionClient.smali patched successfully.")

# ==============================================================================
# 4. MAIN ACTIVITY (Replace Threads with Facebook)
# ==============================================================================
ma_file = r'apk_mod_social_1.2.0/smali/com/prsocial/app/MainActivity.smali'
with open(ma_file, 'r', encoding='utf-8') as f:
    ma_content = f.read()

# Replace strings for threads -> facebook
# In <clinit>: MULTI_PLATFORMS, MULTI_PLATFORM_EMOJIS, MULTI_PLATFORM_NAMES
old_clinit = '''    const-string v4, "threads"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORMS:[Ljava/lang/String;

    .line 124
    const-string v0, "\\u25b6"

    const-string v1, "\\u2708"

    const-string v2, "\\ud83d\\udcf7"

    const-string v3, "\\ud83c\\udfb5"

    const-string v4, "\\ud83e\\uddf5"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORM_EMOJIS:[Ljava/lang/String;

    .line 125
    const-string v0, "YouTube"

    const-string v1, "Telegram"

    const-string v2, "Instagram"

    const-string v3, "TikTok"

    const-string v4, "Threads"'''

new_clinit = '''    const-string v4, "facebook"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORMS:[Ljava/lang/String;

    .line 124
    const-string v0, "\\u25b6"

    const-string v1, "\\u2708"

    const-string v2, "\\ud83d\\udcf7"

    const-string v3, "\\ud83c\\udfb5"

    const-string v4, "\\ud83d\\udcd8"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORM_EMOJIS:[Ljava/lang/String;

    .line 125
    const-string v0, "YouTube"

    const-string v1, "Telegram"

    const-string v2, "Instagram"

    const-string v3, "TikTok"

    const-string v4, "Facebook"'''

assert old_clinit in ma_content, "old_clinit not found"
ma_content = ma_content.replace(old_clinit, new_clinit, 1)

# In bindViews (click listeners for opening Facebook and launching Facebook tasks):
old_bv18 = '''    const-string p1, "https://www.threads.net/"

    const-string v0, "threads"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V'''

new_bv18 = '''    const-string p1, "https://www.facebook.com/"

    const-string v0, "facebook"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V'''

assert old_bv18 in ma_content, "old_bv18 not found"
ma_content = ma_content.replace(old_bv18, new_bv18, 1)

old_bv19 = '''    const-string p1, "threads"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 415
    const-string p1, "Aucun compte Threads li\\u00e9 sur PR.Social"'''

new_bv19 = '''    const-string p1, "facebook"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 415
    const-string p1, "Aucun compte Facebook li\\u00e9 sur PR.Social"'''

assert old_bv19 in ma_content, "old_bv19 not found"
ma_content = ma_content.replace(old_bv19, new_bv19, 1)

# In social check switch (where PR.Social returns approved account list):
old_social_switch = '''    const-string v1, "threads"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z'''
# Let's inspect social check switch in MainActivity.smali to be precise
with open(ma_file, 'w', encoding='utf-8') as f:
    f.write(ma_content)
print("[4a] MainActivity.smali clinit and bindViews patched.")

# ==============================================================================
# 5. ACTIVITY_MAIN.XML (Update UI labels to Facebook)
# ==============================================================================
xml_file = r'apk_mod_social_1.2.0/res/layout/activity_main.xml'
with open(xml_file, 'r', encoding='utf-8') as f:
    xml_content = f.read()

xml_content = xml_content.replace('android:text="\ud83e\uddf5 Threads"', 'android:text="\ud83d\udcd8 Facebook"')
xml_content = xml_content.replace('android:text="\ud83e\uddf5 Ouvrir Threads"', 'android:text="\ud83d\udcd8 Ouvrir Facebook"')

with open(xml_file, 'w', encoding='utf-8') as f:
    f.write(xml_content)
print("[5] activity_main.xml patched successfully.")
