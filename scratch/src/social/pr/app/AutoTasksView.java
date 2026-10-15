package social.pr.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.net.http.SslError;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class AutoTasksView extends LinearLayout {

    private WebView webView;
    private TextView statusText;
    private Button autoPlayBtn;
    private ProgressBar progressBar;
    private boolean isAutoPlay = true;
    private boolean isLoaded = false;

    public static ValueCallback<Uri[]> currentFilePathCallback;
    public static final int FILE_CHOOSER_REQUEST_CODE = 10001;

    private static String cookieToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE4MDE4LCJyb2xlIjoidXNlciIsInR2IjoxLCJpYXQiOjE3ODk4NDg3NzEsImV4cCI6MTc5MDQ1MzU3MX0.zV27CsLBx-UqibJT39Ez3Ztb_9BphNNm9kdn-5u_quc";
    private static String cookieCf = "2WL4ST4VqBxvr4ty22McmC8JOA9TGYQ_7uxkas61KTU-1789848643-1.2.1.1-JmONcBboPPOl4VgDSNWs3UoRXdFg7z0DWDnxpD.xfpY8MkD57HvqM4raH4QokS8gEKiQCPhtEfY4ngg0LVpKBI2XhFB4VMpqOE8r4HxSWP9HvMKIvZ_pqupgn6c5.bzuW8y55rAzJznBZag.FwJD1wArqyiuyWaulCuiCsOWITdIfC3s7OvRhCDwCuKCMJAkND5Kcvojx_wFN359XUqDx3B.HKq5onCk6DZL82FKI24vKjgSQ0ps1KFcmfWKY9qpECQoTzrN_LULeG1ftq.EKyfo7poUSMFmz624.4P_QYFOmYJefJd0ALq8Juox8wHSX_6XKVsVy.xpIEire4bFF4lL.pIHp9RkbJT7URpMM20";

    public static void handleActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE && currentFilePathCallback != null) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                if (data.getData() != null) {
                    results = new Uri[] { data.getData() };
                } else if (data.getClipData() != null) {
                    ClipData clip = data.getClipData();
                    results = new Uri[clip.getItemCount()];
                    for (int i = 0; i < clip.getItemCount(); i++) {
                        results[i] = clip.getItemAt(i).getUri();
                    }
                }
            }
            currentFilePathCallback.onReceiveValue(results);
            currentFilePathCallback = null;
        }
    }

    public class WebAppInterface {
        @JavascriptInterface
        public void onPlatformSwitched(final String platform) {
            post(new Runnable() {
                @Override
                public void run() {
                    if (statusText != null && platform != null && platform.length() > 0) {
                        String name = platform.substring(0, 1).toUpperCase() + platform.substring(1);
                        statusText.setText("\u25CF michelbaggio | " + name);
                    }
                }
            });
        }

        @JavascriptInterface
        public void onTaskAction(final String msg) {
            post(new Runnable() {
                @Override
                public void run() {
                    if (statusText != null && msg != null) {
                        statusText.setText(msg);
                    }
                }
            });
        }
    }

    public AutoTasksView(Context context) {
        super(context);
        init(context);
    }

    private void init(final Context context) {
        setLayoutParams(new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
        ));
        setOrientation(LinearLayout.VERTICAL);
        setBackgroundColor(Color.parseColor("#0b0f19"));

        // Top control strip
        LinearLayout controlStrip = new LinearLayout(context);
        controlStrip.setOrientation(LinearLayout.HORIZONTAL);
        controlStrip.setBackgroundColor(Color.parseColor("#111827"));
        controlStrip.setGravity(Gravity.CENTER_VERTICAL);
        int padH = dpToPx(context, 10);
        int padV = dpToPx(context, 6);
        controlStrip.setPadding(padH, padV, padH, padV);

        // Account status text
        statusText = new TextView(context);
        statusText.setText("\u25CF michelbaggio (Auto)");
        statusText.setTextColor(Color.parseColor("#10b981"));
        statusText.setTextSize(12f);
        statusText.setTypeface(null, Typeface.BOLD);
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        controlStrip.addView(statusText, textParams);

        // Auto-Play Toggle Button
        autoPlayBtn = new Button(context);
        updateAutoPlayBtn();
        autoPlayBtn.setTextSize(11f);
        autoPlayBtn.setPadding(dpToPx(context, 8), 0, dpToPx(context, 8), 0);
        autoPlayBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                isAutoPlay = !isAutoPlay;
                updateAutoPlayBtn();
                injectAutoPlayState();
                if (isAutoPlay) {
                    injectAutomationBot();
                }
                Toast.makeText(context, isAutoPlay ? "Auto-Tasks: ACTIF" : "Auto-Tasks: PAUSE", Toast.LENGTH_SHORT).show();
            }
        });
        LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dpToPx(context, 32));
        btnParams.setMargins(0, 0, dpToPx(context, 4), 0);
        controlStrip.addView(autoPlayBtn, btnParams);

        // Cookie Update Button
        Button cookieBtn = new Button(context);
        cookieBtn.setText("COOKIE");
        cookieBtn.setTextColor(Color.parseColor("#94a3b8"));
        cookieBtn.setBackgroundColor(Color.parseColor("#1f2937"));
        cookieBtn.setTextSize(11f);
        cookieBtn.setPadding(dpToPx(context, 6), 0, dpToPx(context, 6), 0);
        cookieBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                showCookieDialog(context);
            }
        });
        LinearLayout.LayoutParams cookieParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dpToPx(context, 32));
        cookieParams.setMargins(0, 0, dpToPx(context, 4), 0);
        controlStrip.addView(cookieBtn, cookieParams);

        // Refresh Button
        Button refreshBtn = new Button(context);
        refreshBtn.setText("REFRESH");
        refreshBtn.setTextColor(Color.WHITE);
        refreshBtn.setBackgroundColor(Color.parseColor("#374151"));
        refreshBtn.setTextSize(11f);
        refreshBtn.setPadding(dpToPx(context, 6), 0, dpToPx(context, 6), 0);
        refreshBtn.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                setupCookiesAndLoad();
                Toast.makeText(context, "Rechargement...", Toast.LENGTH_SHORT).show();
            }
        });
        LinearLayout.LayoutParams refreshParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, dpToPx(context, 32));
        controlStrip.addView(refreshBtn, refreshParams);

        addView(controlStrip, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        // Loading ProgressBar
        progressBar = new ProgressBar(context, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);
        addView(progressBar, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(context, 3)));

        // WebView Setup
        webView = new WebView(context);
        webView.setBackgroundColor(Color.parseColor("#090d16"));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString("Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36");

        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                android.util.Log.d("AutoTasksBot", consoleMessage.message());
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (currentFilePathCallback != null) {
                    currentFilePathCallback.onReceiveValue(null);
                }
                currentFilePathCallback = filePathCallback;

                Intent intent = null;
                if (fileChooserParams != null) {
                    try {
                        intent = fileChooserParams.createIntent();
                    } catch (Exception ignored) {}
                }
                if (intent == null) {
                    intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("image/*");
                }
                try {
                    if (getContext() instanceof Activity) {
                        ((Activity) getContext()).startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                        return true;
                    }
                } catch (Exception e) {
                    currentFilePathCallback = null;
                    return false;
                }
                return false;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                injectAutomationBot();
            }
        });

        LinearLayout.LayoutParams webParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f
        );
        addView(webView, webParams);

        setupCookiesAndLoad();
    }

    private void updateAutoPlayBtn() {
        if (isAutoPlay) {
            autoPlayBtn.setText("AUTO: ON");
            GradientDrawable gd = new GradientDrawable();
            gd.setColor(Color.parseColor("#16a34a"));
            gd.setCornerRadius(dpToPx(getContext(), 4));
            autoPlayBtn.setBackground(gd);
            autoPlayBtn.setTextColor(Color.WHITE);
        } else {
            autoPlayBtn.setText("AUTO: OFF");
            GradientDrawable gd = new GradientDrawable();
            gd.setColor(Color.parseColor("#4b5563"));
            gd.setCornerRadius(dpToPx(getContext(), 4));
            autoPlayBtn.setBackground(gd);
            autoPlayBtn.setTextColor(Color.parseColor("#d1d5db"));
        }
    }

    public void onShow() {
        if (webView != null) {
            webView.onResume();
        }
        if (!isLoaded || webView.getUrl() == null) {
            isLoaded = true;
            setupCookiesAndLoad();
        } else {
            injectAutoPlayState();
            injectAutomationBot();
        }
    }

    private void setupCookiesAndLoad() {
        try {
            CookieManager cm = CookieManager.getInstance();
            cm.setAcceptCookie(true);
            cm.setAcceptThirdPartyCookies(webView, true);
            String domain = "https://pr.social";
            cm.setCookie(domain, "token=" + cookieToken + "; Domain=pr.social; Path=/; Secure; SameSite=Lax");
            cm.setCookie(domain, "cf_clearance=" + cookieCf + "; Domain=pr.social; Path=/; Secure; SameSite=None");
            cm.flush();
        } catch (Exception e) {}
        if (webView != null) {
            webView.loadUrl("https://pr.social/tasks");
        }
    }

    private void injectAutoPlayState() {
        if (webView == null) return;
        webView.evaluateJavascript("if (window.__setAutoPlay) window.__setAutoPlay(" + isAutoPlay + ");", null);
    }

        private void injectAutomationBot() {
        if (webView == null) return;
        String js = 
            "(function() { " +
            "  window.__autoTasksBotLoaded = true; " +
            "  window.__autoPlayActive = " + isAutoPlay + "; " +
            "  window.__setAutoPlay = function(v) { " +
            "    window.__autoPlayActive = v; " +
            "    if (v) { " +
            "      window.__activeTaskResolving = false; " +
            "      window.__startClickCount = 0; " +
            "      lastModalTime = 0; " +
            "      if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "        window.AndroidBridge.onTaskAction('\\u25CF Auto-Tasks REPRIS !'); " +
            "      } " +
            "    } else { " +
            "      if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "        window.AndroidBridge.onTaskAction('\\u25CF Auto-Tasks en PAUSE'); " +
            "      } " +
            "    } " +
            "  }; " +
            " " +
            "  var PRIORITY_PLATFORMS = ['instagram', 'youtube', 'tiktok', 'telegram', 'facebook', 'github']; " +
            "  var platformCooldowns = {}; " +
            "  var lastModalTime = 0; " +
            "  var lastCommentCopied = false; " +
            "  window.__botSkippedTaskIds = window.__botSkippedTaskIds || {}; " +
            "  window.__activeTaskResolving = false; " +
            "  window.__activeTaskTimeout = null; " +
            "  window.__currentModalTaskId = null; " +
            "  window.__startClickCount = 0; " +
            "  var lastActiveCheckTime = 0; " +
            "  var lastNoCardTime = 0; " +
            " " +
            "  try { " +
            "    localStorage.setItem('pr-user-cache-v1', JSON.stringify({id: 118018, username: 'michelbaggio', role: 'user'})); " +
            "  } catch(e) {} " +
            " " +
            "  function getActivePlatform() { " +
            "    var activeChip = document.querySelector('#platformChips .platform-chip.active'); " +
            "    return activeChip ? (activeChip.dataset.platform || '') : ''; " +
            "  } " +
            " " +
            "  function getLinkedPriorityPlatforms() { " +
            "    var list = []; " +
            "    var now = Date.now(); " +
            "    for (var i = 0; i < PRIORITY_PLATFORMS.length; i++) { " +
            "      var p = PRIORITY_PLATFORMS[i]; " +
            "      var chip = document.querySelector('#platformChips .platform-chip[data-platform=\"' + p + '\"]'); " +
            "      if (chip && !chip.classList.contains('chip-locked')) { " +
            "        var cd = platformCooldowns[p] || 0; " +
            "        if (now >= cd) { list.push({ platform: p, chip: chip }); } " +
            "      } " +
            "    } " +
            "    return list; " +
            "  } " +
            " " +
            "  function switchToPlatform(plat) { " +
            "    var chip = document.querySelector('#platformChips .platform-chip[data-platform=\"' + plat + '\"]'); " +
            "    if (chip && !chip.classList.contains('active')) { " +
            "      chip.click(); " +
            "      if (window.AndroidBridge && window.AndroidBridge.onPlatformSwitched) { " +
            "        window.AndroidBridge.onPlatformSwitched(plat); " +
            "      } " +
            "      return true; " +
            "    } " +
            "    return false; " +
            "  } " +
            " " +
            "  function ensureRewardSort() { " +
            "    var sortBtn = document.querySelector('.sort-btn[data-sort=\"reward\"]'); " +
            "    if (sortBtn && !sortBtn.classList.contains('active')) { sortBtn.click(); } " +
            "  } " +
            " " +
            "  function skipAndCloseTask(taskId) { " +
            "    var tid = taskId || window.__currentModalTaskId; " +
            "    if (tid) { " +
            "      window.__botSkippedTaskIds[String(tid)] = true; " +
            "      var cards = document.querySelectorAll('.task-card'); " +
            "      for (var i = 0; i < cards.length; i++) { " +
            "        var oc = cards[i].getAttribute('onclick') || ''; " +
            "        if (oc.indexOf(String(tid)) !== -1) { " +
            "          cards[i].dataset.botSkipped = 'true'; " +
            "          cards[i].style.display = 'none'; " +
            "        } " +
            "      } " +
            "      if (typeof window.__tasksRemoveFromFeed === 'function') { " +
            "        try { window.__tasksRemoveFromFeed(parseInt(tid, 10), getActivePlatform()); } catch(e) {} " +
            "      } " +
            "    } " +
            "    if (window.__lastClickedCard) { " +
            "      window.__lastClickedCard.dataset.botSkipped = 'true'; " +
            "      window.__lastClickedCard.style.display = 'none'; " +
            "    } " +
            "    if (typeof closeTaskModal === 'function') { " +
            "      try { closeTaskModal(); } catch(e) {} " +
            "    } " +
            "    var modal = document.getElementById('taskModal'); " +
            "    if (modal) modal.remove(); " +
            " " +
            "    window.__currentModalTaskId = null; " +
            "    window.__startClickCount = 0; " +
            "    lastModalTime = 0; " +
            "  } " +
            " " +
            "  function cancelActiveTask(taskId) { " +
            "    if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "      window.AndroidBridge.onTaskAction('\\u25CF Annulation t\\u00E2che active ID ' + taskId + '...'); " +
            "    } " +
            "    fetch('/api/tasks/' + taskId + '/cancel', { " +
            "      method: 'POST', " +
            "      headers: { 'Content-Type': 'application/json' }, " +
            "      credentials: 'same-origin', " +
            "      body: '{}' " +
            "    }).then(function() { " +
            "      if (typeof closeTaskModal === 'function') closeTaskModal(); " +
            "      var modal = document.getElementById('taskModal'); " +
            "      if (modal) modal.remove(); " +
            "      window.__botSkippedTaskIds[String(taskId)] = true; " +
            "      window.__activeTaskResolving = false; " +
            "      clearTimeout(window.__activeTaskTimeout); " +
            "      if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "        window.AndroidBridge.onTaskAction('\\u25CF Compte d\\u00E9bloqu\\u00E9 ! Reprise des gains.'); " +
            "      } " +
            "    }).catch(function() { " +
            "      if (typeof closeTaskModal === 'function') closeTaskModal(); " +
            "      var modal = document.getElementById('taskModal'); " +
            "      if (modal) modal.remove(); " +
            "      window.__activeTaskResolving = false; " +
            "      clearTimeout(window.__activeTaskTimeout); " +
            "    }); " +
            "  } " +
            " " +
            "  function resolveActiveTask() { " +
            "    if (window.__activeTaskResolving) return; " +
            "    window.__activeTaskResolving = true; " +
            " " +
            "    // Safety watchdog: never stay stuck in resolving state longer than 7 seconds " +
            "    clearTimeout(window.__activeTaskTimeout); " +
            "    window.__activeTaskTimeout = setTimeout(function() { " +
            "      if (window.__activeTaskResolving) { " +
            "        console.log('[Bot] Watchdog: resetting activeTaskResolving'); " +
            "        window.__activeTaskResolving = false; " +
            "        if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "          window.AndroidBridge.onTaskAction('\\u25CF Reprise normale du bot'); " +
            "        } " +
            "      } " +
            "    }, 7000); " +
            " " +
            "    if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "      window.AndroidBridge.onTaskAction('\\u25CF T\\u00E2che active d\\u00E9tect\\u00E9e! D\\u00E9blocage...'); " +
            "    } " +
            " " +
            "    fetch('/api/tasks/my/list?status=in_progress', { credentials: 'same-origin' }) " +
            "      .then(function(r) { return r.json(); }) " +
            "      .then(function(data) { " +
            "        var items = data && data.items ? data.items : []; " +
            "        if (items.length === 0) { " +
            "          window.__activeTaskResolving = false; " +
            "          clearTimeout(window.__activeTaskTimeout); " +
            "          if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "            window.AndroidBridge.onTaskAction('\\u25CF Aucune t\\u00E2che active bloquante.'); " +
            "          } " +
            "          return; " +
            "        } " +
            "        var active = items[0]; " +
            "        var activeId = active.order_id || active.id; " +
            "        if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "          window.AndroidBridge.onTaskAction('\\u25CF T\\u00E2che active ID ' + activeId + ' (' + active.platform + ')...'); " +
            "        } " +
            "        if (typeof openTask === 'function') { " +
            "          openTask(activeId); " +
            "        } " +
            "        setTimeout(function() { " +
            "          var apiBtn = document.getElementById('apiCheckBtn'); " +
            "          if (apiBtn && !apiBtn.disabled) { " +
            "            if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "              window.AndroidBridge.onTaskAction('\\u25CF Tentative de validation API...'); " +
            "            } " +
            "            apiBtn.click(); " +
            "            setTimeout(function() { " +
            "              var modal = document.getElementById('taskModal'); " +
            "              if (modal && modal.style.display !== 'none') { " +
            "                cancelActiveTask(activeId); " +
            "              } else { " +
            "                window.__activeTaskResolving = false; " +
            "                clearTimeout(window.__activeTaskTimeout); " +
            "              } " +
            "            }, 3500); " +
            "          } else { " +
            "            cancelActiveTask(activeId); " +
            "          } " +
            "        }, 1200); " +
            "      }) " +
            "      .catch(function() { " +
            "        window.__activeTaskResolving = false; " +
            "        clearTimeout(window.__activeTaskTimeout); " +
            "      }); " +
            "  } " +
            " " +
            "  // Pre-fetch previous completions on startup to populate skip list " +
            "  function preloadPreviousTasks() { " +
            "    fetch('/api/tasks/my/list?per_page=100', { credentials: 'same-origin' }) " +
            "      .then(function(r) { return r.json(); }) " +
            "      .then(function(data) { " +
            "        if (data && data.items) { " +
            "          for (var i = 0; i < data.items.length; i++) { " +
            "            var it = data.items[i]; " +
            "            var oid = it.order_id || it.id; " +
            "            var isActive = it.status === 'in_progress'; " +
            "            if (oid && !isActive) { " +
            "              window.__botSkippedTaskIds[String(oid)] = true; " +
            "              var cards = document.querySelectorAll('.task-card'); " +
            "              for (var j = 0; j < cards.length; j++) { " +
            "                var oc = cards[j].getAttribute('onclick') || ''; " +
            "                if (oc.indexOf(String(oid)) !== -1) { " +
            "                  cards[j].dataset.botSkipped = 'true'; " +
            "                  cards[j].style.display = 'none'; " +
            "                } " +
            "              } " +
            "            } " +
            "            if (isActive) { " +
            "              resolveActiveTask(); " +
            "            } " +
            "          } " +
            "        } " +
            "      }) " +
            "      .catch(function() {}); " +
            "  } " +
            "  preloadPreviousTasks(); " +
            " " +
            "  // Intercept fetch to catch active task errors & claimed task errors immediately " +
            "  if (!window.__botFetchHooked) { " +
            "    window.__botFetchHooked = true; " +
            "    var originalFetch = window.fetch; " +
            "    window.fetch = function(resource, init) { " +
            "      var url = typeof resource === 'string' ? resource : (resource && resource.url ? resource.url : ''); " +
            "      var isStart = url.indexOf('/api/tasks/') !== -1 && url.indexOf('/start') !== -1; " +
            "      var match = isStart ? url.match(/\\/api\\/tasks\\/(\\d+)\\/start/) : null; " +
            "      var taskId = match ? match[1] : null; " +
            " " +
            "      return originalFetch.apply(this, arguments).then(function(response) { " +
            "        if (isStart && !response.ok) { " +
            "          response.clone().json().then(function(data) { " +
            "            var errCode = data.code || ''; " +
            "            var errMsg = (data.error || '').toLowerCase(); " +
            "            if (errCode === 'TASK_IN_PROGRESS' || errMsg.indexOf('active task') !== -1 || errMsg.indexOf('t\\u00E2che active') !== -1) { " +
            "              if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "                window.AndroidBridge.onTaskAction('\\u25CF T\\u00E2che active d\\u00E9j\\u00E0 en cours! R\\u00E9solution...'); " +
            "              } " +
            "              if (typeof closeTaskModal === 'function') closeTaskModal(); " +
            "              setTimeout(function() { resolveActiveTask(); }, 500); " +
            "            } else if (errMsg.indexOf('already claimed') !== -1 || errMsg.indexOf('already') !== -1 || errMsg.indexOf('d\\u00E9j\\u00E0') !== -1 || errMsg.indexOf('not available') !== -1 || errMsg.indexOf('limit') !== -1) { " +
            "              if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "                window.AndroidBridge.onTaskAction('\\u25CF T\\u00E2che d\\u00E9j\\u00E0 effectu\\u00E9e/invalide -> Pass\\u00E9e'); " +
            "              } " +
            "              skipAndCloseTask(taskId); " +
            "            } " +
            "          }).catch(function() {}); " +
            "        } " +
            "        return response; " +
            "      }); " +
            "    }; " +
            "  } " +
            " " +
            "  // Intercept window.showToast " +
            "  if (!window.__botToastHooked) { " +
            "    window.__botToastHooked = true; " +
            "    var originalShowToast = window.showToast; " +
            "    window.showToast = function(msg, type) { " +
            "      try { " +
            "        var text = (msg || '').toLowerCase(); " +
            "        if (type === 'error' || text.indexOf('active task') !== -1 || text.indexOf('already') !== -1) { " +
            "          if (text.indexOf('active task') !== -1 || text.indexOf('t\\u00E2che active') !== -1) { " +
            "            if (typeof closeTaskModal === 'function') closeTaskModal(); " +
            "            setTimeout(function() { resolveActiveTask(); }, 500); " +
            "          } else if (text.indexOf('already claimed') !== -1 || text.indexOf('d\\u00E9j\\u00E0 effectu\\u00E9e') !== -1 || text.indexOf('not available') !== -1) { " +
            "            skipAndCloseTask(window.__currentModalTaskId); " +
            "          } " +
            "        } " +
            "      } catch(e) {} " +
            "      if (typeof originalShowToast === 'function') { " +
            "        return originalShowToast.apply(this, arguments); " +
            "      } " +
            "    }; " +
            "  } " +
            " " +
            "  // Clear previous interval if any " +
            "  if (window.__botInterval) { " +
            "    clearInterval(window.__botInterval); " +
            "  } " +
            " " +
            "  // Main Bot Loop (every 2 seconds) " +
            "  window.__botInterval = setInterval(function() { " +
            "    try { " +
            "      if (!window.__autoPlayActive || window.__activeTaskResolving) return; " +
            "      var now = Date.now(); " +
            "      ensureRewardSort(); " +
            " " +
            "      // Periodic check for active tasks (every 25 seconds) " +
            "      if (now - lastActiveCheckTime > 25000) { " +
            "        lastActiveCheckTime = now; " +
            "        fetch('/api/tasks/my/list?status=in_progress', { credentials: 'same-origin' }) " +
            "          .then(function(r) { return r.json(); }) " +
            "          .then(function(data) { " +
            "            if (data && data.items && data.items.length > 0) { " +
            "              resolveActiveTask(); " +
            "            } " +
            "          }).catch(function() {}); " +
            "      } " +
            " " +
            "      // Account picker modal " +
            "      var accItem = document.querySelector('#accountPickerModal .account-picker-item'); " +
            "      if (accItem) { accItem.click(); return; } " +
            " " +
            "      // Hourly limit modal " +
            "      var limitModal = document.getElementById('hourlyLimitModal'); " +
            "      if (limitModal) { " +
            "        var current = getActivePlatform(); " +
            "        platformCooldowns[current] = now + (10 * 60 * 1000); " +
            "        var limitBtn = limitModal.querySelector('button'); " +
            "        if (limitBtn) limitBtn.click(); " +
            "        if (typeof closeTaskModal === 'function') closeTaskModal(); " +
            "        var modalEl = document.getElementById('taskModal'); " +
            "        if (modalEl) modalEl.remove(); " +
            " " +
            "        var linked = getLinkedPriorityPlatforms(); " +
            "        for (var j = 0; j < linked.length; j++) { " +
            "          if (linked[j].platform !== current) { switchToPlatform(linked[j].platform); break; } " +
            "        } " +
            "        return; " +
            "      } " +
            " " +
            "      // Task modal interaction " +
            "      var taskModal = document.getElementById('taskModal'); " +
            "      if (taskModal && taskModal.style.display !== 'none') { " +
            "        if (!lastModalTime) { " +
            "          lastModalTime = now; " +
            "          lastCommentCopied = false; " +
            "          window.__manualActionNoticeShown = false; " +
            "          window.__startClickCount = 0; " +
            "        } " +
            " " +
            "        var startBtn = document.getElementById('startTaskBtn'); " +
            "        if (startBtn && !startBtn.disabled) { " +
            "          if (window.__startClickCount >= 1) { " +
            "            // Already attempted start once on this modal and startBtn is still enabled -> it failed! " +
            "            if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "              window.AndroidBridge.onTaskAction('\\u25CF \\u00C9chec d\\u00E9marrage -> T\\u00E2che ignor\\u00E9e'); " +
            "            } " +
            "            skipAndCloseTask(window.__currentModalTaskId); " +
            "            return; " +
            "          } " +
            "          window.__startClickCount++; " +
            "          var oc = startBtn.getAttribute('onclick') || ''; " +
            "          var m = oc.match(/startTask\\((\\d+)/); " +
            "          if (m) window.__currentModalTaskId = m[1]; " +
            " " +
            "          if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "            window.AndroidBridge.onTaskAction('\\u25CF D\\u00E9marrage t\\u00E2che...'); " +
            "          } " +
            "          startBtn.click(); " +
            "          return; " +
            "        } " +
            " " +
            "        if (!lastCommentCopied) { " +
            "          var copyBtn = document.querySelector('.tm-comment-copy'); " +
            "          if (copyBtn) { " +
            "            copyBtn.click(); " +
            "            lastCommentCopied = true; " +
            "            if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "              window.AndroidBridge.onTaskAction('\\u25CF Commentaire copi\\u00E9 !'); " +
            "            } " +
            "          } " +
            "        } " +
            " " +
            "        var apiBtn = document.getElementById('apiCheckBtn'); " +
            "        if (apiBtn && !apiBtn.disabled) { " +
            "          if (!window.__manualActionNoticeShown && window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "            window.__manualActionNoticeShown = true; " +
            "            window.AndroidBridge.onTaskAction('\\u25CF Action manuelle requise, puis validation.'); " +
            "          } " +
            "          return; " +
            "        } " +
            " " +
            "        var preview = document.getElementById('uploadPreview'); " +
            "        var submitProofBtn = document.getElementById('submitProofBtn'); " +
            "        if (preview && preview.style.display !== 'none' && submitProofBtn && !submitProofBtn.disabled) { " +
            "          if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "            window.AndroidBridge.onTaskAction('\\u25CF Envoi de la preuve...'); " +
            "          } " +
            "          submitProofBtn.click(); " +
            "          return; " +
            "        } " +
            " " +
            "        var navBtns = document.querySelector('.tm-nav-btns'); " +
            "        if (navBtns) { " +
            "          var browseBtn = navBtns.querySelector('button'); " +
            "          if (browseBtn) { " +
            "            if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "              window.AndroidBridge.onTaskAction('\\u25CF T\\u00E2che valid\\u00E9e ! T\\u00E2che suivante...'); " +
            "            } " +
            "            browseBtn.click(); " +
            "            lastModalTime = 0; " +
            "            return; " +
            "          } " +
            "        } " +
            " " +
            "        // Keep the task open while the user performs the real action and uploads proof. " +
            "        var screenshotUpload = document.getElementById('screenshotUpload'); " +
            "        if (screenshotUpload && screenshotUpload.style.display !== 'none') { " +
            "          if (!window.__manualActionNoticeShown && window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "            window.__manualActionNoticeShown = true; " +
            "            window.AndroidBridge.onTaskAction('\\u25CF Effectuez l\\u0027action puis ajoutez une capture r\\u00E9elle.'); " +
            "          } " +
            "        } " +
            "        return; " +
            "      } " +
            " " +
            "      lastModalTime = 0; " +
            "      lastCommentCopied = false; " +
            "      window.__startClickCount = 0; " +
            " " +
            "      var currentPlat = getActivePlatform(); " +
            " " +
            "      // Find next valid task card on the current platform that hasn't been skipped " +
            "      var cards = document.querySelectorAll('.task-card:not([data-bot-skipped=\"true\"])'); " +
            "      var foundCard = false; " +
            "      if (cards && cards.length > 0) { " +
            "        for (var k = 0; k < cards.length; k++) { " +
            "          var c = cards[k]; " +
            "          var oc = c.getAttribute('onclick') || ''; " +
            "          var m = oc.match(/openTask\\((\\d+)/); " +
            "          var tid = m ? m[1] : null; " +
            "          if (tid && window.__botSkippedTaskIds[String(tid)]) { " +
            "            c.dataset.botSkipped = 'true'; " +
            "            c.style.display = 'none'; " +
            "            continue; " +
            "          } " +
            "          window.__lastClickedCard = c; " +
            "          window.__currentModalTaskId = tid; " +
            "          window.__startClickCount = 0; " +
            "          if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "            window.AndroidBridge.onTaskAction('\\u25CF Ouverture t\\u00E2che ' + currentPlat + '...'); " +
            "          } " +
            "          if (tid && typeof openTask === 'function') { " +
            "            openTask(parseInt(tid, 10)); " +
            "          } else { " +
            "            c.click(); " +
            "          } " +
            "          foundCard = true; " +
            "          break; " +
            "        } " +
            "      } " +
            " " +
            "      // If no valid card found on current platform: " +
            "      if (!foundCard) { " +
            "        // Cooldown current platform for 2 minutes so we don't bounce right back " +
            "        if (currentPlat) { " +
            "          platformCooldowns[currentPlat] = now + (2 * 60 * 1000); " +
            "        } " +
            " " +
            "        var linkedPlatforms = getLinkedPriorityPlatforms(); " +
            "        var switched = false; " +
            "        for (var m = 0; m < linkedPlatforms.length; m++) { " +
            "          if (linkedPlatforms[m].platform !== currentPlat) { " +
            "            switchToPlatform(linkedPlatforms[m].platform); " +
            "            switched = true; " +
            "            break; " +
            "          } " +
            "        } " +
            " " +
            "        // If no other platform is available (all on cooldown or no tasks) " +
            "        if (!switched) { " +
            "          if (!lastNoCardTime) lastNoCardTime = now; " +
            "          if (now - lastNoCardTime > 30000) { " +
            "            // After 30s of no tasks, clear cooldowns and reload " +
            "            platformCooldowns = {}; " +
            "            lastNoCardTime = 0; " +
            "            if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "              window.AndroidBridge.onTaskAction('\\u25CF Actualisation des t\\u00E2ches...'); " +
            "            } " +
            "            if (typeof loadTasks === 'function') { " +
            "              loadTasks(); " +
            "            } else { " +
            "              location.reload(); " +
            "            } " +
            "          } else { " +
            "            if (window.AndroidBridge && window.AndroidBridge.onTaskAction) { " +
            "              window.AndroidBridge.onTaskAction('\\u25CF En attente de nouvelles t\\u00E2ches (' + Math.round((30000 - (now - lastNoCardTime)) / 1000) + 's)...'); " +
            "            } " +
            "          } " +
            "        } else { " +
            "          lastNoCardTime = 0; " +
            "        } " +
            "      } " +
            "    } catch(loopErr) { " +
            "      console.error('[Bot] main loop error:', loopErr); " +
            "    } " +
            "  }, 1000); " +
            "})(); ";
        webView.evaluateJavascript(js, null);
    }

    private void showCookieDialog(final Context context) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Update Web Cookies");
        final EditText input = new EditText(context);
        input.setHint("token=...; cf_clearance=...");
        input.setText("token=" + cookieToken);
        builder.setView(input);

        builder.setPositiveButton("Save & Reload", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String val = input.getText().toString().trim();
                if (val.length() > 0) {
                    if (val.contains("token=")) {
                        int start = val.indexOf("token=") + 6;
                        int end = val.indexOf(";", start);
                        if (end == -1) end = val.length();
                        cookieToken = val.substring(start, end).trim();
                    } else {
                        cookieToken = val;
                    }
                    if (val.contains("cf_clearance=")) {
                        int start = val.indexOf("cf_clearance=") + 13;
                        int end = val.indexOf(";", start);
                        if (end == -1) end = val.length();
                        cookieCf = val.substring(start, end).trim();
                    }
                    setupCookiesAndLoad();
                    Toast.makeText(context, "Cookies mis \u00E0 jour !", Toast.LENGTH_SHORT).show();
                }
            }
        });
        builder.setNegativeButton("Annuler", null);
        builder.show();
    }

    private static int dpToPx(Context context, int dp) {
        float density = context.getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
