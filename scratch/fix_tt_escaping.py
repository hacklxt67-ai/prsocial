import re

with open('apk_mod_social_1.2.0/smali/com/prsocial/app/TikTokActionClient.smali', 'r', encoding='utf-8') as f:
    content = f.read()

# Build valid smali line for buildClickFollowJS
follow_js = (
    "try{var __cb=document.querySelectorAll(\\'[data-e2e=modal-close-icon],[aria-label=Close],[aria-label=Fermer],button[class*=close],div[class*=close]\\');"
    "for(var __ci=0;__ci<__cb.length;__ci++){var __cr=__cb[__ci].getBoundingClientRect();if(__cr.width>0&&__cr.height>0){__cb[__ci].click();}}}catch(e){}"
    "var followBtn=null;"
    "var e2eList=[\\'[data-e2e=follow-button]\\',\\'[data-e2e=user-follow-button]\\',\\'[data-e2e=profile-follow-btn]\\',\\'[data-e2e=profile-action-item-follow]\\',\\'[data-e2e=video-author-follow]\\',\\'[data-e2e=browse-follow-button]\\',\\'[data-e2e=follow-button-click]\\',\\'[data-e2e=user-page-follow-button]\\',\\'[data-e2e=profile-follow]\\',\\'[data-e2e=follow]\\'];"
    "for(var i=0;i<e2eList.length;i++){var el=document.querySelector(e2eList[i]);if(el){followBtn=(el.tagName===\\'BUTTON\\')?el:(el.querySelector(\\'button\\')||el.closest(\\'button\\')||el);break;}}"
    "if(!followBtn){var toFollowTxts=[\\'suivre\\',\\'follow\\',\\'abonner\\',\\'subscribe\\',\\'\\u5173\\u6ce8\\'];var ab=document.querySelectorAll(\\'button,[role=button],a,div[class*=follow],div[class*=Follow]\\');"
    "for(var b=0;b<ab.length;b++){var rc=ab[b].getBoundingClientRect();if(rc.width===0||rc.height===0)continue;var txt=(ab[b].textContent||ab[b].innerText||\\'\\').trim().toLowerCase();"
    "for(var t=0;t<toFollowTxts.length;t++){if(txt.indexOf(toFollowTxts[t])!==-1){followBtn=(ab[b].tagName===\\'BUTTON\\')?ab[b]:(ab[b].closest(\\'button\\')||ab[b]);break;}}if(followBtn)break;}}"
    "if(!followBtn){var ab3=document.querySelectorAll(\\'button,[role=button],a\\');for(var b3=0;b3<ab3.length;b3++){var lbl3=(ab3[b3].getAttribute(\\'aria-label\\')||\\'\\').toLowerCase();"
    "if(lbl3.indexOf(\\'follow\\')!==-1||lbl3.indexOf(\\'suivre\\')!==-1||lbl3.indexOf(\\'abonner\\')!==-1){var rc3=ab3[b3].getBoundingClientRect();if(rc3.width>0&&rc3.height>0){followBtn=(ab3[b3].tagName===\\'BUTTON\\')?ab3[b3]:(ab3[b3].closest(\\'button\\')||ab3[b3]);break;}}}}"
    "if(!followBtn){var debug=[];var dbab=document.querySelectorAll(\\'button,[role=button]\\');for(var d=0;d<dbab.length&&d<25;d++){var drc=dbab[d].getBoundingClientRect();if(drc.width===0||drc.height===0)continue;"
    "var dtxt=(dbab[d].textContent||\\'\\').trim().substring(0,20);var de2e=dbab[d].getAttribute(\\'data-e2e\\')||\\'\\';debug.push((de2e?\\'[\\'+de2e+\\']\\':\\'\\')+dtxt);}alert(\\'TGAPP|not_found|\\'+debug.join(\\'|||\\'));}"
    "else{var btnTxt=(followBtn.textContent||followBtn.innerText||\\'\\').trim().toLowerCase();var ariaLbl=(followBtn.getAttribute(\\'aria-label\\')||\\'\\').toLowerCase();var ap=followBtn.getAttribute(\\'aria-pressed\\');"
    "var cls=(followBtn.getAttribute(\\'class\\')||\\'\\').toLowerCase();var alreadyList=[\\'suivi\\',\\'following\\',\\'amis\\',\\'friends\\',\\'\\u00e9\\',\\'abonne\\',\\'unfollow\\',\\'ne plus suivre\\',\\'\\u5df2\\u5173\\u6ce8\\',\\'\\u5173\\u6ce8\\u4e2d\\',\\'\\u4e92\\u76f8\\u5173\\u6ce8\\',\\'\\u597d\\u53cb\\'];"
    "var isFollowing=ap===\\'true\\'||cls.indexOf(\\'following\\')!==-1;for(var al=0;al<alreadyList.length;al++){if(btnTxt===alreadyList[al]||btnTxt.indexOf(alreadyList[al])!==-1||ariaLbl.indexOf(alreadyList[al])!==-1){isFollowing=true;break;}}"
    "if(isFollowing){alert(\\'TGAPP|already_following|\\'+btnTxt);}else{"
)

# In buildClickFollowJS: replace from "const-string v2, " up to "else{"
pat = r'const-string v2, ".*?(?:else\{|else \{)"'
match = re.search(pat, content, flags=re.DOTALL)
assert match is not None, "Could not match const-string v2 in buildClickFollowJS"

replacement = 'const-string v2, "' + follow_js + '"'
content = content[:match.start()] + replacement + content[match.end():]

with open('apk_mod_social_1.2.0/smali/com/prsocial/app/TikTokActionClient.smali', 'w', encoding='utf-8') as f:
    f.write(content)

print("TikTokActionClient.smali patched successfully.")
