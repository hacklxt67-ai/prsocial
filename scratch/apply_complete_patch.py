import os
import shutil
import re

print("=== APPLYING COMPLETE PATCH ===")

# Base directory
base_dir = r"apk_mod_social_1.2.0"

# Restore all orig files first to ensure a completely clean patch run
orig_files = [
    os.path.join(base_dir, "res", "layout", "activity_main.xml"),
    os.path.join(base_dir, "smali", "com", "prsocial", "app", "TikTokActionClient.smali"),
    os.path.join(base_dir, "smali", "com", "prsocial", "app", "TaskWebViewActivity.smali"),
    os.path.join(base_dir, "smali", "com", "prsocial", "app", "InstagramActionClient.smali"),
    os.path.join(base_dir, "smali", "com", "prsocial", "app", "MainActivity.smali"),
]

for f in orig_files:
    orig = f + ".orig"
    if os.path.exists(orig):
        shutil.copy(orig, f)
        print(f"Restored from orig: {f}")

# Backup MainActivity$5.smali if not yet backed up
ma5_path = os.path.join(base_dir, "smali", "com", "prsocial", "app", "MainActivity$5.smali")
ma5_orig = os.path.join(base_dir, "smali", "com", "prsocial", "app", "MainActivity$5.smali.orig")
if not os.path.exists(ma5_orig):
    shutil.copy(ma5_path, ma5_orig)
    print("Created MainActivity$5.smali.orig")
else:
    shutil.copy(ma5_orig, ma5_path)
    print("Restored MainActivity$5.smali from orig")

# ==============================================================================
# 1. TIKTOK ACTION CLIENT (Enhanced click + popup dismiss + selectors)
# ==============================================================================
tt_file = os.path.join(base_dir, "smali", "com", "prsocial", "app", "TikTokActionClient.smali")
with open(tt_file, "r", encoding="utf-8") as f:
    tt_content = f.read()

# Replace simulateClickJS with touch-capable and native click
new_sim = """.method public static simulateClickJS(Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "try{var __el=("

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, ");if(__el){try{var __r=__el.getBoundingClientRect();var __cx=__r.left+__r.width/2;var __cy=__r.top+__r.height/2;var __po=function(t,pt){return new PointerEvent(t,{bubbles:true,cancelable:true,view:window,clientX:__cx,clientY:__cy,screenX:__cx,screenY:__cy,pointerId:1,pointerType:pt||'touch',isPrimary:true});};var __mo=function(t){return new MouseEvent(t,{bubbles:true,cancelable:true,view:window,clientX:__cx,clientY:__cy,screenX:__cx,screenY:__cy});};__el.dispatchEvent(__po('pointerover','mouse'));__el.dispatchEvent(__mo('mouseover'));__el.dispatchEvent(__po('pointerdown','touch'));__el.dispatchEvent(__mo('mousedown'));__el.dispatchEvent(__po('pointerup','touch'));__el.dispatchEvent(__mo('mouseup'));__el.dispatchEvent(__mo('click'));}catch(e){}try{if(typeof __el.click==='function'){__el.click();}}catch(e){}}}catch(e){}"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method"""

old_sim_pat = r'\.method public static simulateClickJS\(Ljava/lang/String;\)Ljava/lang/String;.*?\.end method'
tt_content, n = re.subn(old_sim_pat, new_sim, tt_content, flags=re.DOTALL)
assert n == 1, "simulateClickJS replacement failed"

# In buildClickFollowJS: Add modal popup dismiss & enhanced selectors
new_follow_script_prefix = 'try{var __cb=document.querySelectorAll(\'[data-e2e="modal-close-icon"],[aria-label="Close"],[aria-label="Fermer"],button[class*="close" i],div[class*="close" i]\');for(var __ci=0;__ci<__cb.length;__ci++){var __cr=__cb[__ci].getBoundingClientRect();if(__cr.width>0&&__cr.height>0){__cb[__ci].click();}}}catch(e){}var followBtn=null;var e2eList=[\'[data-e2e*="follow"]\',\'[data-e2e="follow-button"]\',\'[data-e2e="user-follow-button"]\',\'[data-e2e="profile-follow-btn"]\',\'[data-e2e="profile-action-item-follow"]\',\'[data-e2e="video-author-follow"]\',\'[data-e2e="browse-follow-button"]\',\'[data-e2e="follow-button-click"]\',\'[data-e2e="user-page-follow-button"]\',\'[data-e2e="profile-follow"]\',\'[data-e2e="follow"]\'];for(var i=0;i<e2eList.length;i++){var el=document.querySelector(e2eList[i]);if(el){followBtn=(el.tagName===\'BUTTON\')?el:(el.querySelector(\'button\')||el.closest(\'button\')||el);break;}}if(!followBtn){var toFollowTxts=[\'suivre\',\'follow\',\'abonner\',"s\'abonner",\'关注\',\'subscribe\',"s\'abonner en retour",\'suivre en retour\',\'follow back\'];var ab=document.querySelectorAll(\'button,[role="button"],a,div[class*="follow" i],div[class*="Follow" i]\');for(var b=0;b<ab.length;b++){var rc=ab[b].getBoundingClientRect();if(rc.width===0||rc.height===0)continue;var txt=(ab[b].textContent||ab[b].innerText||\'\').trim().toLowerCase();for(var t=0;t<toFollowTxts.length;t++){if(txt.indexOf(toFollowTxts[t])!==-1){followBtn=(ab[b].tagName===\'BUTTON\')?ab[b]:(ab[b].closest(\'button\')||ab[b]);break;}}if(followBtn)break;}}if(!followBtn){var ab3=document.querySelectorAll(\'button,[role="button"],a\');for(var b3=0;b3<ab3.length;b3++){var lbl3=(ab3[b3].getAttribute(\'aria-label\')||\'\').toLowerCase();if(lbl3.indexOf(\'follow\')!==-1||lbl3.indexOf(\'suivre\')!==-1||lbl3.indexOf(\'abonner\')!==-1){var rc3=ab3[b3].getBoundingClientRect();if(rc3.width>0&&rc3.height>0){followBtn=(ab3[b3].tagName===\'BUTTON\')?ab3[b3]:(ab3[b3].closest(\'button\')||ab3[b3]);break;}}}}if(!followBtn){var debug=[];var dbab=document.querySelectorAll(\'button,[role="button"]\');for(var d=0;d<dbab.length&&d<25;d++){var drc=dbab[d].getBoundingClientRect();if(drc.width===0||drc.height===0)continue;var dtxt=(dbab[d].textContent||\'\').trim().substring(0,20);var de2e=dbab[d].getAttribute(\'data-e2e\')||\'\';debug.push((de2e?\'[\'+de2e+\']\':\'\')+dtxt);}alert(\'TGAPP|not_found|\'+debug.join(\';;;\'));} else {var btnTxt=(followBtn.textContent||followBtn.innerText||\'\').trim().toLowerCase();var ariaLbl=(followBtn.getAttribute(\'aria-label\')||\'\').toLowerCase();var ap=followBtn.getAttribute(\'aria-pressed\');var cls=(followBtn.getAttribute(\'class\')||\'\').toLowerCase();var alreadyList=[\'suivi\',\'following\',\'amis\',\'friends\',\'abonné\',\'abonne\',\'unfollow\',\'ne plus suivre\',\'已关注\',\'关注中\',\'互相关注\',\'好友\'];var isFollowing=ap===\'true\'||cls.indexOf(\'following\')!==-1;for(var al=0;al<alreadyList.length;al++){if(btnTxt===alreadyList[al]||btnTxt.indexOf(alreadyList[al])!==-1||ariaLbl.indexOf(alreadyList[al])!==-1){isFollowing=true;break;}}if(isFollowing){alert(\'TGAPP|already_following|\'+btnTxt);} else {'

# Replace string in buildClickFollowJS
tt_content, n = re.subn(r'const-string v2, "var followBtn=null;var e2eList=.*?else\{"', 'const-string v2, "' + new_follow_script_prefix + '"', tt_content, flags=re.DOTALL)
assert n == 1, "buildClickFollowJS replacement failed"

with open(tt_file, "w", encoding="utf-8") as f:
    f.write(tt_content)
print("[1] TikTokActionClient.smali successfully patched.")

# ==============================================================================
# 2. TASK WEB VIEW ACTIVITY (Fix not_found retry + Fix screenshot ENOENT + Facebook auto-submit)
# ==============================================================================
twa_file = os.path.join(base_dir, "smali", "com", "prsocial", "app", "TaskWebViewActivity.smali")
with open(twa_file, "r", encoding="utf-8") as f:
    twa_content = f.read()

# Fix A: in handleTikTokFollowResult, :pswitch_1 (not_found):
# If tikTokActionAttempts < 5, retry with delay 1500ms instead of immediate report
old_pswitch1 = """:pswitch_1
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1072
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1073
    const-string p1, "Cible introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1074
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_2"""

new_pswitch1 = """:pswitch_1
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

    goto :goto_2"""

assert old_pswitch1 in twa_content, "old_pswitch1 not found"
twa_content = twa_content.replace(old_pswitch1, new_pswitch1, 1)

# Fix B: in onDestroy, remove premature selectedImage.delete() (prevents ENOENT race condition)
old_destroy_del = """    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-eqz v0, :cond_2

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v0

    if-eqz v0, :cond_2

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    invoke-virtual {v0}, Ljava/io/File;->delete()Z

    .line 1740
    :cond_2"""

new_destroy_del = """    :cond_1
    # Preserved file: safely cleaned up by ApiClient.submitScreenshot upon upload completion
    :cond_2"""

assert old_destroy_del in twa_content, "old_destroy_del not found"
twa_content = twa_content.replace(old_destroy_del, new_destroy_del, 1)

# Fix C: in onPageLoadedForAutoSubmit, add facebook branch to trigger autoCaptureAndSubmit
old_action_branch = """    :cond_3
    :goto_0
    const-string v0, "tiktok"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4"""

new_action_branch = """    :cond_3
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

    if-eqz v0, :cond_4"""

assert old_action_branch in twa_content, "old_action_branch not found"
twa_content = twa_content.replace(old_action_branch, new_action_branch, 1)

with open(twa_file, "w", encoding="utf-8") as f:
    f.write(twa_content)
print("[2] TaskWebViewActivity.smali successfully patched.")

# ==============================================================================
# 3. INSTAGRAM ACTION CLIENT (Align User-Agent + followRedirects(false) + FAILED state)
# ==============================================================================
ig_file = os.path.join(base_dir, "smali", "com", "prsocial", "app", "InstagramActionClient.smali")
with open(ig_file, "r", encoding="utf-8") as f:
    ig_content = f.read()

# Fix A: User-Agent alignment
ig_content = ig_content.replace(
    'Mozilla/5.0 (Linux; Android 11; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
)

# Fix B: followRedirects(false) and followSslRedirects(false) on OkHttpClient in <init>
old_okhttp_init = """    invoke-virtual {v0}, Lokhttp3/OkHttpClient$Builder;->build()Lokhttp3/OkHttpClient;

    move-result-object v0

    iput-object v0, p0, Lcom/prsocial/app/InstagramActionClient;->client:Lokhttp3/OkHttpClient;"""

new_okhttp_init = """    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Lokhttp3/OkHttpClient$Builder;->followRedirects(Z)Lokhttp3/OkHttpClient$Builder;

    move-result-object v0

    invoke-virtual {v0, v1}, Lokhttp3/OkHttpClient$Builder;->followSslRedirects(Z)Lokhttp3/OkHttpClient$Builder;

    move-result-object v0

    invoke-virtual {v0}, Lokhttp3/OkHttpClient$Builder;->build()Lokhttp3/OkHttpClient;

    move-result-object v0

    iput-object v0, p0, Lcom/prsocial/app/InstagramActionClient;->client:Lokhttp3/OkHttpClient;"""

assert old_okhttp_init in ig_content, "old_okhttp_init not found"
ig_content = ig_content.replace(old_okhttp_init, new_okhttp_init, 1)

# Fix C: in interpret, if html and not-logged-in (from 302 redirect), return state "FAILED" instead of "NOT_LOGGED_IN"
old_ig_not_logged = """    const-string p1, "NOT_LOGGED_IN"

    if-eqz v1, :cond_4

    if-eqz v2, :cond_4"""

new_ig_not_logged = """    const-string p1, "FAILED"

    if-eqz v1, :cond_4

    if-eqz v2, :cond_4"""

assert old_ig_not_logged in ig_content, "old_ig_not_logged not found"
ig_content = ig_content.replace(old_ig_not_logged, new_ig_not_logged, 1)

with open(ig_file, "w", encoding="utf-8") as f:
    f.write(ig_content)
print("[3] InstagramActionClient.smali successfully patched.")

# ==============================================================================
# 4. MAIN ACTIVITY (Replace Threads with Facebook)
# ==============================================================================
ma_file = os.path.join(base_dir, "smali", "com", "prsocial", "app", "MainActivity.smali")
with open(ma_file, "r", encoding="utf-8") as f:
    ma_content = f.read()

# 4.1 In <clinit>: MULTI_PLATFORMS, MULTI_PLATFORM_EMOJIS, MULTI_PLATFORM_NAMES
old_clinit = """    const-string v4, "threads"

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

    const-string v4, \"Threads\""""

new_clinit = """    const-string v4, "facebook"

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

    const-string v4, "Facebook\""""

assert old_clinit in ma_content, "old_clinit not found"
ma_content = ma_content.replace(old_clinit, new_clinit, 1)

# 4.2 In lambda$bindViews$18: open Facebook URL
old_bv18 = """    const-string p1, "https://www.threads.net/"

    const-string v0, "threads"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V"""

new_bv18 = """    const-string p1, "https://www.facebook.com/"

    const-string v0, "facebook"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V"""

assert old_bv18 in ma_content, "old_bv18 not found"
ma_content = ma_content.replace(old_bv18, new_bv18, 1)

# 4.3 In lambda$bindViews$19: launch Facebook tasks
old_bv19 = """    const-string p1, "threads"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 415
    const-string p1, "Aucun compte Threads li\\u00e9 sur PR.Social\""""

new_bv19 = """    const-string p1, "facebook"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 415
    const-string p1, "Aucun compte Facebook li\\u00e9 sur PR.Social\""""

assert old_bv19 in ma_content, "old_bv19 not found"
ma_content = ma_content.replace(old_bv19, new_bv19, 1)

# 4.4 In applyAutomationBlockStatus:
old_apply_block = """    const-string v0, "instagram"

    const-string v1, "youtube"

    const-string v2, "threads"

    const-string v3, "tiktok\""""

new_apply_block = """    const-string v0, "instagram"

    const-string v1, "youtube"

    const-string v2, "facebook"

    const-string v3, "tiktok\""""

assert old_apply_block in ma_content, "old_apply_block not found"
ma_content = ma_content.replace(old_apply_block, new_apply_block, 1)

# Switch table in applyAutomationBlockStatus (around line 2074)
old_switch_2074 = """    :sswitch_data_0
    .sparse-switch
        -0x4fbf4c57 -> :sswitch_3
        -0x3b1cd4dd -> :sswitch_2
        -0x3413cf06 -> :sswitch_1
        0x1b907b2 -> :sswitch_0
    .end sparse-switch"""

new_switch_2074 = """    :sswitch_data_0
    .sparse-switch
        -0x3b1cd4dd -> :sswitch_2
        -0x3413cf06 -> :sswitch_1
        0x1b907b2 -> :sswitch_0
        0x1da19ac6 -> :sswitch_3
    .end sparse-switch"""

assert old_switch_2074 in ma_content, "old_switch_2074 not found"
ma_content = ma_content.replace(old_switch_2074, new_switch_2074, 1)

# 4.5 In applyPlatformButtonStates (around line 2107)
old_apb = """    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    const-string v1, "threads\""""

new_apb = """    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    const-string v1, "facebook\""""

assert old_apb in ma_content, "old_apb not found"
ma_content = ma_content.replace(old_apb, new_apb, 1)

# 4.6 In the 6 helper methods:
# appendLog (1377), getActiveLogContainer (3497), getActiveLogHeader (3635),
# getActiveLogScroll (3773), getButtonForPlatform (3904), getLogContainerForPlatform (4045),
# getProgressForPlatform (4172).
# In each of these:
# const-string [register], "threads" -> const-string [register], "facebook"
# And in their .sparse-switch:
#         -0x511716ff -> :sswitch_3
#         -0x4fbf4c57 -> :sswitch_2
#         -0x3b1cd4dd -> :sswitch_1
#         -0x3413cf06 -> :sswitch_0
# becomes:
#         -0x511716ff -> :sswitch_3
#         -0x3b1cd4dd -> :sswitch_1
#         -0x3413cf06 -> :sswitch_0
#         0x1da19ac6 -> :sswitch_2

old_6_switch = """    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch"""

new_6_switch = """    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
        0x1da19ac6 -> :sswitch_2
    .end sparse-switch"""

# Check count of occurrences:
switch_count = ma_content.count(old_6_switch)
print(f"Found {switch_count} occurrences of 4-way platform sparse-switch")
assert switch_count == 7, f"Expected 7 occurrences of 4-way platform sparse-switch, found {switch_count}"
ma_content = ma_content.replace(old_6_switch, new_6_switch)

# Replace target string "threads" in each of those switch cases:
# appendLog:
ma_content = ma_content.replace('const-string p3, "threads"', 'const-string p3, "facebook"', 1)
# getActiveLogContainer:
ma_content = ma_content.replace('const-string v1, "threads"\n\n    invoke-virtual {v0, v1}, Ljava/lang/String;->equals', 'const-string v1, "facebook"\n\n    invoke-virtual {v0, v1}, Ljava/lang/String;->equals', 1)
# getActiveLogHeader:
ma_content = ma_content.replace('const-string v1, "threads"\n\n    invoke-virtual {v0, v1}, Ljava/lang/String;->equals', 'const-string v1, "facebook"\n\n    invoke-virtual {v0, v1}, Ljava/lang/String;->equals', 1)
# getActiveLogScroll:
ma_content = ma_content.replace('const-string v1, "threads"\n\n    invoke-virtual {v0, v1}, Ljava/lang/String;->equals', 'const-string v1, "facebook"\n\n    invoke-virtual {v0, v1}, Ljava/lang/String;->equals', 1)
# getButtonForPlatform:
ma_content = ma_content.replace('const-string v0, "threads"\n\n    invoke-virtual {p1, v0}, Ljava/lang/String;->equals', 'const-string v0, "facebook"\n\n    invoke-virtual {p1, v0}, Ljava/lang/String;->equals', 1)
# getLogContainerForPlatform:
ma_content = ma_content.replace('const-string v0, "threads"\n\n    invoke-virtual {p1, v0}, Ljava/lang/String;->equals', 'const-string v0, "facebook"\n\n    invoke-virtual {p1, v0}, Ljava/lang/String;->equals', 1)
# getProgressForPlatform:
ma_content = ma_content.replace('const-string v0, "threads"\n\n    invoke-virtual {p1, v0}, Ljava/lang/String;->equals', 'const-string v0, "facebook"\n\n    invoke-virtual {p1, v0}, Ljava/lang/String;->equals', 1)

# 4.7 In dispatchTaskAction & performHttpActionThenLaunch:
# Prevent facebook from attempting Threads HTTP client; facebook will launch via TaskWebViewActivity (cond_7)
old_threads_http = """    const-string v0, "threads"

    invoke-virtual {v0, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z"""

new_threads_http = """    const-string v0, "unused_threads"

    invoke-virtual {v0, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z"""

assert old_threads_http in ma_content, "old_threads_http not found"
ma_content = ma_content.replace(old_threads_http, new_threads_http, 1)

with open(ma_file, "w", encoding="utf-8") as f:
    f.write(ma_content)
print("[4] MainActivity.smali successfully patched.")

# ==============================================================================
# 5. MAIN ACTIVITY $5 (Social accounts parsing from /profile/socials)
# ==============================================================================
with open(ma5_path, "r", encoding="utf-8") as f:
    ma5_content = f.read()

# Replace reset title "Threads" with "Facebook"
ma5_content = ma5_content.replace('const-string v2, "Threads"', 'const-string v2, "Facebook"', 1)

# Replace default map entry "threads" with "facebook"
ma5_content = ma5_content.replace('const-string v5, "threads"', 'const-string v5, "facebook"', 1)

# Replace sparse switch in onSuccess (threads -> facebook)
old_ma5_switch = """    :sswitch_data_0
    .sparse-switch
        -0x4fbf4c57 -> :sswitch_3
        -0x3b1cd4dd -> :sswitch_2
        -0x3413cf06 -> :sswitch_1
        0x1b907b2 -> :sswitch_0
    .end sparse-switch"""

new_ma5_switch = """    :sswitch_data_0
    .sparse-switch
        -0x3b1cd4dd -> :sswitch_2
        -0x3413cf06 -> :sswitch_1
        0x1b907b2 -> :sswitch_0
        0x1da19ac6 -> :sswitch_3
    .end sparse-switch"""

assert old_ma5_switch in ma5_content, "old_ma5_switch not found"
ma5_content = ma5_content.replace(old_ma5_switch, new_ma5_switch, 1)

with open(ma5_path, "w", encoding="utf-8") as f:
    f.write(ma5_content)
print("[5] MainActivity$5.smali successfully patched.")

# ==============================================================================
# 6. ACTIVITY_MAIN.XML (Update UI labels to Facebook)
# ==============================================================================
xml_file = os.path.join(base_dir, "res", "layout", "activity_main.xml")
with open(xml_file, "r", encoding="utf-8") as f:
    xml_content = f.read()

# Replace UI strings
xml_content = xml_content.replace('android:text="\ud83e\uddf5 Threads"', 'android:text="\ud83d\udcd8 Facebook"')
xml_content = xml_content.replace('android:text="\ud83e\uddf5 Ouvrir Threads"', 'android:text="\ud83d\udcd8 Ouvrir Facebook"')

with open(xml_file, "w", encoding="utf-8") as f:
    f.write(xml_content)
print("[6] activity_main.xml successfully patched.")

print("=== ALL PATCHES APPLIED SUCCESSFULLY ===")
