.class public Lcom/prsocial/app/TaskWebViewActivity;
.super Landroidx/appcompat/app/AppCompatActivity;
.source "TaskWebViewActivity.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/prsocial/app/TaskWebViewActivity$SubmitStartCallback;,
        Lcom/prsocial/app/TaskWebViewActivity$onCapture;,
        Lcom/prsocial/app/TaskWebViewActivity$SubmitResultCallback;
    }
.end annotation


# static fields
.field private static final AUTO_ACTION_SCHEMES:Ljava/util/Set;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Set<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private static final MIN_RENDER_WAIT_MS:J = 0x7d0L

.field private static final POST_DISMISS_WAIT_MS:J = 0x5dcL

.field private static final POST_DOM_READY_SETTLE_MS:J = 0x7d0L

.field private static final RETRY_RENDER_WAIT_MS:J = 0x1f4L

.field private static final TAG:Ljava/lang/String; = "PRSocial_TaskFlow"

.field private static final TG_DOM_MAX_WAIT_MS:J = 0x7530L

.field private static final TG_DOM_POLL_INTERVAL_MS:J = 0x190L

.field private static final TG_MUTATION_SETTLE_MS:J = 0x9c4L

.field private static final WATCHDOG_TIMEOUT_MS:J = 0x4e20L

.field public static submitResultCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitResultCallback;

.field public static submitStartCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitStartCallback;

.field private static final submittingTaskIds:Ljava/util/Set;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Set<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field


# instance fields
.field private actionType:Ljava/lang/String;

.field private activeSession:Lorg/mozilla/geckoview/GeckoSession;

.field private autoActionResolved:Z

.field private autoMode:Z

.field private awaitingAutoCapture:Z

.field private awaitingPopupDismiss:Z

.field private btnBack:Landroid/widget/ImageButton;

.field private btnCapture:Lcom/google/android/material/button/MaterialButton;

.field private btnForward:Landroid/widget/ImageButton;

.field private btnRefresh:Landroid/widget/ImageButton;

.field private btnSkip:Lcom/google/android/material/button/MaterialButton;

.field private btnSubmit:Lcom/google/android/material/button/MaterialButton;

.field private canGoBack:Z

.field private canGoForward:Z

.field private currentPlatform:Ljava/lang/String;

.field private final domReadyCheckRunnable:Ljava/lang/Runnable;

.field private final filePickerLauncher:Landroidx/activity/result/ActivityResultLauncher;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Landroidx/activity/result/ActivityResultLauncher<",
            "Landroid/content/Intent;",
            ">;"
        }
    .end annotation
.end field

.field private geckoView:Lorg/mozilla/geckoview/GeckoView;

.field private final handler:Landroid/os/Handler;

.field private httpActionAlreadyDone:Z

.field private lastPageStartAtMs:J

.field private lastProgress:I

.field private lastSeenUrl:Ljava/lang/String;

.field private pageLoadHandled:Z

.field private pageStopCountSinceReload:I

.field private pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

.field private pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Lorg/mozilla/geckoview/GeckoResult<",
            "Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$PromptResponse;",
            ">;"
        }
    .end annotation
.end field

.field private progressBar:Landroid/widget/ProgressBar;

.field private selectedImage:Ljava/io/File;

.field private final sessionStack:Ljava/util/ArrayDeque;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/ArrayDeque<",
            "Lorg/mozilla/geckoview/GeckoSession;",
            ">;"
        }
    .end annotation
.end field

.field private taskId:Ljava/lang/String;

.field private taskUrl:Ljava/lang/String;

.field private terminalActionTriggered:Z

.field private tgDomPollRound:I

.field private tgDomPollRunnable:Ljava/lang/Runnable;

.field private tgDomPollStart:J

.field private tikTokActionAttempts:I

.field private tikTokActionExecuted:Z

.field private tikTokDomPollRunnable:Ljava/lang/Runnable;

.field private tikTokDomPollStart:J

.field private tikTokLastDomSnap:Ljava/lang/String;

.field private tikTokPageScanRunnable:Ljava/lang/Runnable;

.field private tikTokPendingAction:Ljava/lang/String;

.field private tikTokPrevDomSnap:Ljava/lang/String;

.field private tikTokScanAfterClick:Z

.field private tikTokSessionReloads:I

.field private token:Ljava/lang/String;

.field private tvActionType:Landroid/widget/TextView;

.field private tvStatus:Landroid/widget/TextView;

.field private urlInput:Lcom/google/android/material/textfield/TextInputEditText;

.field private watchdogRunnable:Ljava/lang/Runnable;

.field private wrongUrlReloadCount:I


# direct methods
.method public static synthetic $r8$lambda$1RVHGxBHnCF9eL7zZ1-78gs1E7E(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->performTikTokFollow()V

    return-void
.end method

.method public static synthetic $r8$lambda$2CB1Hu0wHd92QrOd2CV-n2oYbVs(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->pollTikTokButton()V

    return-void
.end method

.method public static synthetic $r8$lambda$4kVvCZqITq8hlfucMAprpQ52ZEA(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->pollTelegramDom()V

    return-void
.end method

.method public static synthetic $r8$lambda$PRcmGhl4JWU27H7sL9dOQfodbYQ(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->performTikTokLike()V

    return-void
.end method

.method static constructor <clinit>()V
    .locals 1

    .line 97
    const-string v0, "prsocial"

    invoke-static {v0}, Ljava/util/Collections;->singleton(Ljava/lang/Object;)Ljava/util/Set;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/TaskWebViewActivity;->AUTO_ACTION_SCHEMES:Ljava/util/Set;

    const/4 v0, 0x0

    .line 1470
    sput-object v0, Lcom/prsocial/app/TaskWebViewActivity;->submitResultCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitResultCallback;

    .line 1475
    sput-object v0, Lcom/prsocial/app/TaskWebViewActivity;->submitStartCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitStartCallback;

    .line 1478
    new-instance v0, Ljava/util/HashSet;

    invoke-direct {v0}, Ljava/util/HashSet;-><init>()V

    .line 1479
    invoke-static {v0}, Ljava/util/Collections;->synchronizedSet(Ljava/util/Set;)Ljava/util/Set;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/TaskWebViewActivity;->submittingTaskIds:Ljava/util/Set;

    return-void
.end method

.method public constructor <init>()V
    .locals 6

    .line 24
    invoke-direct {p0}, Landroidx/appcompat/app/AppCompatActivity;-><init>()V

    .line 29
    new-instance v0, Ljava/util/ArrayDeque;

    invoke-direct {v0}, Ljava/util/ArrayDeque;-><init>()V

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    const/4 v0, 0x0

    .line 35
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoMode:Z

    .line 36
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->httpActionAlreadyDone:Z

    const/4 v1, 0x0

    .line 45
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    .line 46
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    .line 48
    new-instance v2, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;

    invoke-direct {v2}, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;-><init>()V

    new-instance v3, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda3;

    invoke-direct {v3, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda3;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    .line 49
    invoke-virtual {p0, v2, v3}, Lcom/prsocial/app/TaskWebViewActivity;->registerForActivityResult(Landroidx/activity/result/contract/ActivityResultContract;Landroidx/activity/result/ActivityResultCallback;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object v2

    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->filePickerLauncher:Landroidx/activity/result/ActivityResultLauncher;

    .line 72
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageLoadHandled:Z

    .line 73
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoActionResolved:Z

    .line 74
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 75
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 76
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoBack:Z

    .line 77
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoForward:Z

    .line 78
    const-string v2, ""

    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    .line 79
    const-string v3, "instagram"

    iput-object v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    .line 82
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->watchdogRunnable:Ljava/lang/Runnable;

    .line 86
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 87
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 88
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    .line 89
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    const-wide/16 v3, 0x0

    .line 90
    iput-wide v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollStart:J

    .line 91
    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokLastDomSnap:Ljava/lang/String;

    .line 92
    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPrevDomSnap:Ljava/lang/String;

    .line 93
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollRunnable:Ljava/lang/Runnable;

    .line 94
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPageScanRunnable:Ljava/lang/Runnable;

    .line 96
    new-instance v2, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v5

    invoke-direct {v2, v5}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    .line 104
    iput-wide v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastPageStartAtMs:J

    .line 105
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    .line 106
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastProgress:I

    .line 107
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingPopupDismiss:Z

    .line 108
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->wrongUrlReloadCount:I

    .line 110
    new-instance v2, Lcom/prsocial/app/TaskWebViewActivity$1;

    invoke-direct {v2, p0}, Lcom/prsocial/app/TaskWebViewActivity$1;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    .line 582
    iput-wide v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollStart:J

    .line 583
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRunnable:Ljava/lang/Runnable;

    .line 584
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRound:I

    .line 762
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    return-void
.end method

.method static synthetic access$000(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    .line 24
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->checkDOMReady()V

    return-void
.end method

.method static synthetic access$100(Lcom/prsocial/app/TaskWebViewActivity;)Landroid/os/Handler;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    return-object p0
.end method

.method static synthetic access$1002(Lcom/prsocial/app/TaskWebViewActivity;Z)Z
    .locals 0

    .line 24
    iput-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoForward:Z

    return p1
.end method

.method static synthetic access$1100(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/lang/String;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$1102(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    .line 24
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    return-object p1
.end method

.method static synthetic access$1200(Lcom/prsocial/app/TaskWebViewActivity;)Lcom/google/android/material/textfield/TextInputEditText;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->urlInput:Lcom/google/android/material/textfield/TextInputEditText;

    return-object p0
.end method

.method static synthetic access$1300(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)Z
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleAutoResultUri(Ljava/lang/String;)Z

    move-result p0

    return p0
.end method

.method static synthetic access$1400(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)Z
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->shouldOpenExternally(Ljava/lang/String;)Z

    move-result p0

    return p0
.end method

.method static synthetic access$1500(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)V
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->openExternal(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$1600(Lcom/prsocial/app/TaskWebViewActivity;Lorg/mozilla/geckoview/GeckoSession;)V
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->attachDelegates(Lorg/mozilla/geckoview/GeckoSession;)V

    return-void
.end method

.method static synthetic access$1700(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/util/ArrayDeque;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    return-object p0
.end method

.method static synthetic access$1800(Lcom/prsocial/app/TaskWebViewActivity;)Lorg/mozilla/geckoview/GeckoView;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->geckoView:Lorg/mozilla/geckoview/GeckoView;

    return-object p0
.end method

.method static synthetic access$1900(Lcom/prsocial/app/TaskWebViewActivity;Z)V
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handlePageReady(Z)V

    return-void
.end method

.method static synthetic access$2000(Lcom/prsocial/app/TaskWebViewActivity;)Landroid/widget/ProgressBar;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->progressBar:Landroid/widget/ProgressBar;

    return-object p0
.end method

.method static synthetic access$202(Lcom/prsocial/app/TaskWebViewActivity;Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;)Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;
    .locals 0

    .line 24
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    return-object p1
.end method

.method static synthetic access$2102(Lcom/prsocial/app/TaskWebViewActivity;J)J
    .locals 0

    .line 24
    iput-wide p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastPageStartAtMs:J

    return-wide p1
.end method

.method static synthetic access$2202(Lcom/prsocial/app/TaskWebViewActivity;I)I
    .locals 0

    .line 24
    iput p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastProgress:I

    return p1
.end method

.method static synthetic access$2308(Lcom/prsocial/app/TaskWebViewActivity;)I
    .locals 2

    .line 24
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    add-int/lit8 v1, v0, 0x1

    iput v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    return v0
.end method

.method static synthetic access$2400(Lcom/prsocial/app/TaskWebViewActivity;)Z
    .locals 0

    .line 24
    iget-boolean p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoMode:Z

    return p0
.end method

.method static synthetic access$2500(Lcom/prsocial/app/TaskWebViewActivity;)Z
    .locals 0

    .line 24
    iget-boolean p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    return p0
.end method

.method static synthetic access$2600(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)Z
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->isReadyVisualPage(Ljava/lang/String;)Z

    move-result p0

    return p0
.end method

.method static synthetic access$2700(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/lang/String;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$2800(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/lang/Runnable;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    return-object p0
.end method

.method static synthetic access$2900(Lcom/prsocial/app/TaskWebViewActivity;)Z
    .locals 0

    .line 24
    iget-boolean p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    return p0
.end method

.method static synthetic access$3000(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/lang/String;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$3002(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    .line 24
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    return-object p1
.end method

.method static synthetic access$302(Lcom/prsocial/app/TaskWebViewActivity;Lorg/mozilla/geckoview/GeckoResult;)Lorg/mozilla/geckoview/GeckoResult;
    .locals 0

    .line 24
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    return-object p1
.end method

.method static synthetic access$3100(Lcom/prsocial/app/TaskWebViewActivity;)Z
    .locals 0

    .line 24
    iget-boolean p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    return p0
.end method

.method static synthetic access$3200(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    .line 24
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startTikTokDomPolling()V

    return-void
.end method

.method static synthetic access$3300(Lcom/prsocial/app/TaskWebViewActivity;)Z
    .locals 0

    .line 24
    iget-boolean p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageLoadHandled:Z

    return p0
.end method

.method static synthetic access$3302(Lcom/prsocial/app/TaskWebViewActivity;Z)Z
    .locals 0

    .line 24
    iput-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageLoadHandled:Z

    return p1
.end method

.method static synthetic access$3400(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    .line 24
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->onPageLoadedForAutoSubmit()V

    return-void
.end method

.method static synthetic access$3500(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)V
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$3600(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    .line 24
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startTelegramDomReadyPolling()V

    return-void
.end method

.method static synthetic access$3700(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    .line 24
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->closeTopSession()V

    return-void
.end method

.method static synthetic access$3800(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/lang/String;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$3900()Ljava/util/Set;
    .locals 1

    .line 24
    sget-object v0, Lcom/prsocial/app/TaskWebViewActivity;->submittingTaskIds:Ljava/util/Set;

    return-object v0
.end method

.method static synthetic access$400(Lcom/prsocial/app/TaskWebViewActivity;)Landroidx/activity/result/ActivityResultLauncher;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->filePickerLauncher:Landroidx/activity/result/ActivityResultLauncher;

    return-object p0
.end method

.method static synthetic access$4000(Lcom/prsocial/app/TaskWebViewActivity;)Ljava/lang/String;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$4100(Lcom/prsocial/app/TaskWebViewActivity;)Lcom/google/android/material/button/MaterialButton;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSkip:Lcom/google/android/material/button/MaterialButton;

    return-object p0
.end method

.method static synthetic access$4200(Lcom/prsocial/app/TaskWebViewActivity;)Lcom/google/android/material/button/MaterialButton;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSubmit:Lcom/google/android/material/button/MaterialButton;

    return-object p0
.end method

.method static synthetic access$500(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)V
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTelegramDomPollResult(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$600(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)V
    .locals 0

    .line 24
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokJsResult(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$700(Lcom/prsocial/app/TaskWebViewActivity;)Lorg/mozilla/geckoview/GeckoSession;
    .locals 0

    .line 24
    iget-object p0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    return-object p0
.end method

.method static synthetic access$702(Lcom/prsocial/app/TaskWebViewActivity;Lorg/mozilla/geckoview/GeckoSession;)Lorg/mozilla/geckoview/GeckoSession;
    .locals 0

    .line 24
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    return-object p1
.end method

.method static synthetic access$802(Lcom/prsocial/app/TaskWebViewActivity;Z)Z
    .locals 0

    .line 24
    iput-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoBack:Z

    return p1
.end method

.method static synthetic access$900(Lcom/prsocial/app/TaskWebViewActivity;)V
    .locals 0

    .line 24
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->updateNavigationButtons()V

    return-void
.end method

.method private applyWebGLFix()V
    .locals 2

    .line 444
    const-string v0, "javascript:(function() {if (window.__prsWebGLFixed) return;window.__prsWebGLFixed = true;try {  var ctxProto = WebGLRenderingContext.prototype;  var origShaderSource = ctxProto.shaderSource;  ctxProto.shaderSource = function(shader, source) {    if (typeof source === \'string\') {      source = source        .replace(/#\\\\s*extension\\\\s+GL_EXT_frag_depth\\\\s*:[^\\\\n]+/g, \'\')        .replace(/#\\\\s*extension\\\\s+GL_EXT_shader_texture_lod\\\\s*:[^\\\\n]+/g, \'\')        .replace(/#\\\\s*extension\\\\s+GL_EXT_draw_buffers\\\\s*:[^\\\\n]+/g, \'\')        .replace(/#\\\\s*extension\\\\s+EXT_frag_depth\\\\s*:[^\\\\n]+/g, \'\')        .replace(/#\\\\s*extension\\\\s+EXT_shader_texture_lod\\\\s*:[^\\\\n]+/g, \'\');    }    return origShaderSource.call(this, shader, source);};  var origGetExt = ctxProto.getExtension;  ctxProto.getExtension = function(name) {    if (name && /(?:EXT_frag_depth|EXT_shader_texture_lod|EXT_draw_buffers|WEBGL_draw_buffers)/.test(name)) {      return null;    }    return origGetExt.call(this, name);};} catch(e) { console.log(\'[PRS] WebGL fix err:\', e.message); }})();"

    .line 470
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v1, v0}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    return-void
.end method

.method private attachDelegates(Lorg/mozilla/geckoview/GeckoSession;)V
    .locals 1

    .line 253
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$2;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$2;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoSession;->setPromptDelegate(Lorg/mozilla/geckoview/GeckoSession$PromptDelegate;)V

    .line 295
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$3;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$3;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoSession;->setNavigationDelegate(Lorg/mozilla/geckoview/GeckoSession$NavigationDelegate;)V

    .line 343
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$4;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$4;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoSession;->setProgressDelegate(Lorg/mozilla/geckoview/GeckoSession$ProgressDelegate;)V

    .line 394
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$5;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$5;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoSession;->setContentDelegate(Lorg/mozilla/geckoview/GeckoSession$ContentDelegate;)V

    return-void
.end method

.method private autoCaptureAndSubmit()V
    .locals 1

    .line 1401
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-eqz v0, :cond_0

    return-void

    :cond_0
    const/4 v0, 0x1

    .line 1402
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 1403
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelWatchdog()V

    .line 1404
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda35;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda35;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private cancelTelegramDomPolling()V
    .locals 2

    .line 677
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRunnable:Ljava/lang/Runnable;

    if-eqz v0, :cond_0

    .line 678
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    const/4 v0, 0x0

    .line 679
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRunnable:Ljava/lang/Runnable;

    :cond_0
    return-void
.end method

.method private cancelTikTokDomPolling()V
    .locals 3

    .line 749
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollRunnable:Ljava/lang/Runnable;

    const/4 v1, 0x0

    if-eqz v0, :cond_0

    .line 750
    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    invoke-virtual {v2, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 751
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollRunnable:Ljava/lang/Runnable;

    .line 753
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokPageScanLoop()V

    .line 754
    const-string v0, "wait_btn"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "dom_snapshot"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 755
    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "page_scan"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 756
    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    .line 757
    :cond_1
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    :cond_2
    return-void
.end method

.method private cancelTikTokPageScanLoop()V
    .locals 2

    .line 712
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPageScanRunnable:Ljava/lang/Runnable;

    if-eqz v0, :cond_0

    .line 713
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    const/4 v0, 0x0

    .line 714
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPageScanRunnable:Ljava/lang/Runnable;

    :cond_0
    return-void
.end method

.method private cancelWatchdog()V
    .locals 2

    .line 1393
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->watchdogRunnable:Ljava/lang/Runnable;

    if-eqz v0, :cond_0

    .line 1394
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    invoke-virtual {v1, v0}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    const/4 v0, 0x0

    .line 1395
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->watchdogRunnable:Ljava/lang/Runnable;

    :cond_0
    return-void
.end method

.method private captureVisibleViewport(Lcom/prsocial/app/TaskWebViewActivity$onCapture;)V
    .locals 2

    .line 1482
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->geckoView:Lorg/mozilla/geckoview/GeckoView;

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoView;->capturePixels()Lorg/mozilla/geckoview/GeckoResult;

    move-result-object v0

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda9;

    invoke-direct {v1, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda9;-><init>(Lcom/prsocial/app/TaskWebViewActivity$onCapture;)V

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoResult;->accept(Lorg/mozilla/geckoview/GeckoResult$Consumer;)Lorg/mozilla/geckoview/GeckoResult;

    return-void
.end method

.method private checkDOMReady()V
    .locals 11

    .line 1190
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-nez v0, :cond_f

    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    if-nez v0, :cond_0

    goto/16 :goto_7

    .line 1191
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->isReadyVisualPage(Ljava/lang/String;)Z

    move-result v0

    const-wide/16 v1, 0x1f4

    if-nez v0, :cond_1

    .line 1192
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v3, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 1198
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->isSameDomainAsTask(Ljava/lang/String;)Z

    move-result v0

    const-wide/16 v3, 0x7d0

    const/4 v5, 0x0

    if-nez v0, :cond_3

    .line 1199
    invoke-static {}, Landroid/os/SystemClock;->uptimeMillis()J

    move-result-wide v6

    iget-wide v8, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastPageStartAtMs:J

    sub-long/2addr v6, v8

    cmp-long v0, v6, v3

    if-ltz v0, :cond_2

    .line 1200
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    if-lez v0, :cond_2

    .line 1201
    iput-boolean v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 1202
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda18;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda18;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 1204
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v3, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :goto_0
    return-void

    .line 1211
    :cond_3
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->isWrongUrl(Ljava/lang/String;)Z

    move-result v0

    const/4 v6, 0x1

    if-eqz v0, :cond_6

    .line 1212
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->wrongUrlReloadCount:I

    add-int/2addr v0, v6

    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->wrongUrlReloadCount:I

    const/4 v1, 0x2

    .line 1213
    const-string v2, "PRSocial_TaskFlow"

    if-le v0, v1, :cond_4

    .line 1214
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "Wrong URL after "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->wrongUrlReloadCount:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v1, " reloads, capturing anyway: "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v2, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1215
    iput-boolean v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 1216
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda19;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda19;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 1219
    :cond_4
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "Wrong URL detected ("

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->wrongUrlReloadCount:I

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v1, "/2): "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " \u2192 reloading"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v2, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1220
    iput v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    .line 1221
    iput v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastProgress:I

    .line 1222
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_5

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->normalizeUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    .line 1223
    :cond_5
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v1, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 1227
    :cond_6
    invoke-static {}, Landroid/os/SystemClock;->uptimeMillis()J

    move-result-wide v7

    iget-wide v9, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastPageStartAtMs:J

    sub-long/2addr v7, v9

    cmp-long v0, v7, v3

    if-ltz v0, :cond_7

    const/4 v0, 0x1

    goto :goto_1

    :cond_7
    const/4 v0, 0x0

    .line 1229
    :goto_1
    iget-object v7, p0, Lcom/prsocial/app/TaskWebViewActivity;->progressBar:Landroid/widget/ProgressBar;

    invoke-virtual {v7}, Landroid/widget/ProgressBar;->getVisibility()I

    move-result v7

    if-eqz v7, :cond_8

    const/4 v7, 0x1

    goto :goto_2

    :cond_8
    const/4 v7, 0x0

    .line 1230
    :goto_2
    iget v8, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastProgress:I

    const/16 v9, 0x5f

    if-ge v8, v9, :cond_a

    if-eqz v7, :cond_9

    iget v7, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    if-lez v7, :cond_9

    goto :goto_3

    :cond_9
    const/4 v7, 0x0

    goto :goto_4

    :cond_a
    :goto_3
    const/4 v7, 0x1

    .line 1231
    :goto_4
    iget v8, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    if-lez v8, :cond_b

    goto :goto_5

    :cond_b
    const/4 v6, 0x0

    :goto_5
    if-eqz v0, :cond_e

    if-eqz v7, :cond_e

    if-nez v6, :cond_c

    goto :goto_6

    .line 1239
    :cond_c
    iput-boolean v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 1240
    const-string v0, "youtube"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_d

    const-wide/16 v3, 0xfa0

    .line 1241
    :cond_d
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda20;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda20;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 1234
    :cond_e
    :goto_6
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v3, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :cond_f
    :goto_7
    return-void
.end method

.method private closeTopSession()V
    .locals 2

    .line 407
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->isOpen()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->close()V

    .line 408
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {v0}, Ljava/util/ArrayDeque;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_1

    .line 409
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {v0}, Ljava/util/ArrayDeque;->removeLast()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lorg/mozilla/geckoview/GeckoSession;

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const/4 v0, 0x0

    .line 410
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoBack:Z

    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoForward:Z

    .line 411
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->updateNavigationButtons()V

    .line 412
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->geckoView:Lorg/mozilla/geckoview/GeckoView;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoView;->setSession(Lorg/mozilla/geckoview/GeckoSession;)V

    goto :goto_0

    .line 414
    :cond_1
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->finish()V

    :goto_0
    return-void
.end method

.method private doSubmit()V
    .locals 4

    .line 1548
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSubmit:Lcom/google/android/material/button/MaterialButton;

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Lcom/google/android/material/button/MaterialButton;->setEnabled(Z)V

    .line 1549
    const-string v0, "Envoi..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1550
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    new-instance v3, Lcom/prsocial/app/TaskWebViewActivity$10;

    invoke-direct {v3, p0}, Lcom/prsocial/app/TaskWebViewActivity$10;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {v0, v1, v2, v3}, Lcom/prsocial/app/ApiClient;->submitScreenshot(Ljava/lang/String;Ljava/lang/String;Ljava/io/File;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private doSubmitBackground()V
    .locals 4

    .line 1419
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-nez v0, :cond_0

    return-void

    .line 1421
    :cond_0
    sget-object v0, Lcom/prsocial/app/TaskWebViewActivity;->submittingTaskIds:Ljava/util/Set;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    invoke-interface {v0, v1}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    .line 1422
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "doSubmitBackground: taskId "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " already submitting, skipping duplicate"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "PRSocial_TaskFlow"

    invoke-static {v1, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1423
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v0

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    invoke-virtual {v0}, Ljava/io/File;->delete()Z

    :cond_1
    return-void

    .line 1426
    :cond_2
    sget-object v0, Lcom/prsocial/app/TaskWebViewActivity;->submitStartCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitStartCallback;

    if-eqz v0, :cond_3

    invoke-interface {v0}, Lcom/prsocial/app/TaskWebViewActivity$SubmitStartCallback;->onSubmitStart()V

    .line 1427
    :cond_3
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-eqz v0, :cond_no_screenshot

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v3

    if-eqz v3, :cond_no_screenshot

    .line 1428
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    new-instance v3, Lcom/prsocial/app/TaskWebViewActivity$8;

    invoke-direct {v3, p0, v0}, Lcom/prsocial/app/TaskWebViewActivity$8;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Ljava/io/File;)V

    invoke-static {v1, v2, v0, v3}, Lcom/prsocial/app/ApiClient;->submitScreenshot(Ljava/lang/String;Ljava/lang/String;Ljava/io/File;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void

    :cond_no_screenshot
    const-string v1, "PRSocial_TaskFlow"

    const-string v2, "Screenshot file missing - skipping submit (ENOENT fix)"

    invoke-static {v1, v2}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    return-void
.end method
.method private extractUrlId(Ljava/lang/String;)Ljava/lang/String;
    .locals 6

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return-object v0

    .line 1618
    :cond_0
    :try_start_0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    .line 1619
    invoke-virtual {p1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v1

    if-nez v1, :cond_1

    return-object v0

    .line 1621
    :cond_1
    const-string v2, "/"

    invoke-virtual {v1, v2}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x0

    .line 1622
    :goto_0
    array-length v3, v1

    if-ge v2, v3, :cond_6

    .line 1623
    aget-object v3, v1, v2

    invoke-virtual {v3}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    .line 1625
    const-string v4, "p"

    invoke-virtual {v4, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_2

    const-string v4, "reel"

    invoke-virtual {v4, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_2

    const-string v4, "reels"

    invoke-virtual {v4, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_3

    :cond_2
    add-int/lit8 v4, v2, 0x1

    array-length v5, v1

    if-ge v4, v5, :cond_3

    .line 1627
    aget-object v4, v1, v4

    invoke-virtual {v4}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v4

    .line 1628
    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v5

    if-nez v5, :cond_3

    return-object v4

    .line 1632
    :cond_3
    const-string v4, "shorts"

    invoke-virtual {v4, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_4

    const-string v4, "live"

    invoke-virtual {v4, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_5

    :cond_4
    add-int/lit8 v3, v2, 0x1

    array-length v4, v1

    if-ge v3, v4, :cond_5

    .line 1634
    aget-object v3, v1, v3

    invoke-virtual {v3}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    .line 1635
    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v4

    if-nez v4, :cond_5

    return-object v3

    :cond_5
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 1639
    :cond_6
    const-string v2, "v"

    invoke-virtual {p1, v2}, Landroid/net/Uri;->getQueryParameter(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    if-eqz v2, :cond_7

    .line 1640
    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    if-nez v3, :cond_7

    return-object v2

    .line 1642
    :cond_7
    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object p1

    if-eqz p1, :cond_8

    .line 1643
    const-string v2, "youtu.be"

    invoke-virtual {p1, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_8

    array-length p1, v1

    const/4 v2, 0x1

    if-le p1, v2, :cond_8

    .line 1644
    array-length p1, v1

    sub-int/2addr p1, v2

    aget-object p1, v1, p1

    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p1

    :catch_0
    :cond_8
    return-object v0
.end method

.method private handleActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;)V
    .locals 4

    .line 1149
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-eqz v0, :cond_0

    return-void

    .line 1150
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->resetWatchdog()V

    .line 1151
    iget-boolean v0, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->success:Z

    const-string v1, "PRSocial_TaskFlow"

    const/4 v2, 0x1

    if-eqz v0, :cond_1

    .line 1152
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p2, " HTTP action success state="

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object p2, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-static {v1, p2}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1153
    iget-object p1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1154
    iput-boolean v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    const/4 p1, 0x0

    .line 1155
    iput p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    .line 1156
    iput p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastProgress:I

    .line 1157
    iput p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->wrongUrlReloadCount:I

    .line 1158
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object p2, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {p1, p2}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 1159
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->applyWebGLFix()V

    .line 1162
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz p1, :cond_6

    iget-object p2, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    invoke-direct {p0, p2}, Lcom/prsocial/app/TaskWebViewActivity;->normalizeUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    goto/16 :goto_2

    .line 1164
    :cond_1
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v3, " HTTP action failed state="

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v3, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v1, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1165
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " ["

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, "]"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 1166
    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->details:Ljava/lang/String;

    if-eqz v1, :cond_3

    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->details:Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_2

    goto :goto_0

    :cond_2
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "\n"

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v3, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->details:Ljava/lang/String;

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_1

    :cond_3
    :goto_0
    const-string v1, ""

    :goto_1
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 1167
    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->isTargetUnavailableState(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_4

    .line 1168
    iput-boolean v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 1169
    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p2, "\nCible indisponible -> report"

    invoke-virtual {p1, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 1170
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    return-void

    .line 1173
    :cond_4
    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->isCriticalAccountState(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_5

    .line 1174
    iput-boolean v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 1175
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, "\nArret auto: verifiez le compte "

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p2, "."

    invoke-virtual {v1, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-direct {p0, p2}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 1176
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    return-void

    .line 1179
    :cond_5
    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 1180
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSkip:Lcom/google/android/material/button/MaterialButton;

    invoke-virtual {p1, v2}, Lcom/google/android/material/button/MaterialButton;->setEnabled(Z)V

    :cond_6
    :goto_2
    return-void
.end method

.method private handleAutoResultUri(Ljava/lang/String;)Z
    .locals 4

    const/4 v0, 0x0

    if-eqz p1, :cond_5

    .line 1338
    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_0

    .line 1339
    :cond_0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    .line 1340
    invoke-virtual {p1}, Landroid/net/Uri;->getScheme()Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_5

    .line 1341
    sget-object v2, Lcom/prsocial/app/TaskWebViewActivity;->AUTO_ACTION_SCHEMES:Ljava/util/Set;

    sget-object v3, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v1, v3}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v1

    invoke-interface {v2, v1}, Ljava/util/Set;->contains(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    .line 1344
    :cond_1
    const-string v1, "auto-result"

    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    const-string v2, "domready"

    if-nez v1, :cond_2

    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v2, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_2

    return v0

    .line 1347
    :cond_2
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoActionResolved:Z

    const/4 v1, 0x1

    if-eqz v0, :cond_3

    return v1

    .line 1349
    :cond_3
    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v0

    .line 1350
    invoke-virtual {v2, v0}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    const-string v2, "1"

    if-eqz v0, :cond_4

    .line 1351
    invoke-virtual {p1}, Landroid/net/Uri;->getLastPathSegment()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    .line 1352
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v2, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda28;

    invoke-direct {v2, p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda28;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Z)V

    invoke-virtual {v0, v2}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    return v1

    .line 1357
    :cond_4
    const-string v0, "type"

    invoke-virtual {p1, v0}, Landroid/net/Uri;->getQueryParameter(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 1358
    const-string v3, "ok"

    invoke-virtual {p1, v3}, Landroid/net/Uri;->getQueryParameter(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    .line 1359
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoActionResolved:Z

    .line 1360
    new-instance v2, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda29;

    invoke-direct {v2, p0, p1, v0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda29;-><init>(Lcom/prsocial/app/TaskWebViewActivity;ZLjava/lang/String;)V

    invoke-virtual {p0, v2}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return v1

    :cond_5
    :goto_0
    return v0
.end method

.method private handlePageReady(Z)V
    .locals 3

    if-eqz p1, :cond_0

    const/4 p1, 0x0

    .line 1322
    iput-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 1323
    const-string p1, "Page pr\u00eate, stabilisation visuelle..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1326
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda16;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda16;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x7d0

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 1328
    :cond_0
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    const-wide/16 v1, 0x1f4

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :goto_0
    return-void
.end method

.method private handleTelegramDomPollResult(Ljava/lang/String;)V
    .locals 11

    const-string v0, "Telegram: en attente sinceLastMut="

    .line 1268
    iget-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-nez v1, :cond_a

    iget-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    if-nez v1, :cond_0

    goto/16 :goto_3

    .line 1269
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTelegramDomPolling()V

    .line 1270
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v1

    iget-wide v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollStart:J

    sub-long/2addr v1, v3

    .line 1271
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "Telegram DOM poll["

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRound:I

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v4, "] result="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v4, " elapsed="

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3, v1, v2}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    const-string v4, "ms"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    const-string v4, "PRSocial_TaskFlow"

    invoke-static {v4, v3}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1273
    const-string v3, "1"

    invoke-virtual {v3, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    const/4 v5, 0x0

    if-eqz v3, :cond_1

    .line 1275
    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "Telegram contenu visible, capture dans 5000ms (elapsed="

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1, v1, v2}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    const-string v0, "ms)"

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {v4, p1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1276
    iput-boolean v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 1277
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda14;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda14;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x1388

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 1281
    :cond_1
    const-string v1, "settled"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    .line 1283
    const-string p1, "Telegram DOM settled (filet de s\u00e9curit\u00e9), capture dans 300ms"

    invoke-static {v4, p1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1284
    iput-boolean v5, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 1285
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda15;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda15;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x12c

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 1289
    :cond_2
    const-string v1, "no_observer"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_3

    .line 1291
    const-string p1, "Telegram: MutationObserver absent, r\u00e9-injection"

    invoke-static {v4, p1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1292
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->injectTelegramMutationObserver()V

    .line 1293
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->scheduleTelegramDomPoll()V

    return-void

    .line 1297
    :cond_3
    const-string v1, "err:"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_4

    .line 1299
    const-string p1, "Telegram: erreur JS poll \u2192 re-poll"

    invoke-static {v4, p1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1300
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->scheduleTelegramDomPoll()V

    return-void

    .line 1305
    :cond_4
    const-string v1, "waiting:"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_9

    .line 1307
    :try_start_0
    const-string v1, ":"

    invoke-virtual {p1, v1}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    .line 1308
    array-length v1, p1

    const/4 v2, 0x1

    if-le v1, v2, :cond_5

    aget-object v1, p1, v2

    invoke-static {v1}, Ljava/lang/Long;->parseLong(Ljava/lang/String;)J

    move-result-wide v6

    goto :goto_0

    :cond_5
    const-wide/16 v6, 0x0

    .line 1309
    :goto_0
    array-length v1, p1

    const/4 v3, 0x2

    if-le v1, v3, :cond_6

    aget-object v1, p1, v3

    invoke-static {v1}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v1

    goto :goto_1

    :cond_6
    const/4 v1, 0x0

    .line 1310
    :goto_1
    array-length v3, p1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    const-string v8, "true"

    const/4 v9, 0x3

    if-le v3, v9, :cond_7

    :try_start_1
    aget-object v3, p1, v9

    invoke-virtual {v8, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_7

    const/4 v3, 0x1

    goto :goto_2

    :cond_7
    const/4 v3, 0x0

    .line 1311
    :goto_2
    array-length v9, p1

    const/4 v10, 0x4

    if-le v9, v10, :cond_8

    aget-object p1, p1, v10

    invoke-virtual {v8, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_8

    const/4 v5, 0x1

    .line 1312
    :cond_8
    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1, v6, v7}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    const-string v0, "ms mutCount="

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v0, " titleFound="

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1, v3}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    const-string v0, " contentFound="

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1, v5}, Ljava/lang/StringBuilder;->append(Z)Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {v4, p1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    .line 1317
    :catch_0
    :cond_9
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->scheduleTelegramDomPoll()V

    :cond_a
    :goto_3
    return-void
.end method

.method private handleTikTokFollowResult(Ljava/lang/String;)V
    .locals 6

    .line 1044
    const-string v0, "\\|"

    const/4 v1, -0x1

    invoke-virtual {p1, v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;I)[Ljava/lang/String;

    move-result-object v0

    .line 1045
    array-length v2, v0

    const/4 v3, 0x0

    if-lez v2, :cond_0

    aget-object p1, v0, v3

    .line 1046
    :cond_0
    array-length v2, v0

    const/4 v4, 0x1

    if-le v2, v4, :cond_1

    aget-object v0, v0, v4

    goto :goto_0

    :cond_1
    const-string v0, ""

    .line 1048
    :goto_0
    const-string v2, "not_found"

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_2

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->isLoginButtonVisible(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2

    .line 1049
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 1050
    const-string p1, "Compte TikTok d\u00e9connect\u00e9"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 1051
    new-instance p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;

    const-string v0, "NOT_LOGGED_IN"

    const-string v1, "TikTok d\u00e9connect\u00e9"

    invoke-direct {p1, v3, v0, v1}, Lcom/prsocial/app/InstagramActionClient$ActionResult;-><init>(ZLjava/lang/String;Ljava/lang/String;)V

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    return-void

    .line 1055
    :cond_2
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    sparse-switch v0, :sswitch_data_0

    goto :goto_1

    :sswitch_0
    const-string v0, "already_following"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_1

    :cond_3
    const/4 v1, 0x2

    goto :goto_1

    :sswitch_1
    invoke-virtual {p1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_4

    goto :goto_1

    :cond_4
    const/4 v1, 0x1

    goto :goto_1

    :sswitch_2
    const-string v0, "clicked"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_5

    goto :goto_1

    :cond_5
    const/4 v1, 0x0

    :goto_1
    packed-switch v1, :pswitch_data_0

    .line 1077
    const-string p1, "Action en cours..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    goto :goto_2

    .line 1057
    :pswitch_0
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1058
    const-string p1, "Follow r\u00e9ussi !"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1059
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->triggerTikTokCaptureFlow()V

    goto :goto_2

    .line 1071
    :pswitch_1
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1072
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1073
    const-string p1, "Cible introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1074
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_2

    .line 1063
    :pswitch_2
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    .line 1064
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda17;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda17;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x320

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :goto_2
    return-void

    :sswitch_data_0
    .sparse-switch
        0x334a9027 -> :sswitch_2
        0x604afb16 -> :sswitch_1
        0x70270f6a -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private handleTikTokJsResult(Ljava/lang/String;)V
    .locals 3

    .line 873
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "handleTikTokJsResult pendingAction="

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " data="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "PRSocial_TaskFlow"

    invoke-static {v1, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 874
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    if-nez v0, :cond_0

    return-void

    :cond_0
    const/4 v1, 0x0

    .line 876
    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 878
    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "check_login"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v2, 0x6

    goto :goto_0

    :sswitch_1
    const-string v1, "page_scan"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_0

    :cond_2
    const/4 v2, 0x5

    goto :goto_0

    :sswitch_2
    const-string v1, "wait_btn"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    goto :goto_0

    :cond_3
    const/4 v2, 0x4

    goto :goto_0

    :sswitch_3
    const-string v1, "like"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_4

    goto :goto_0

    :cond_4
    const/4 v2, 0x3

    goto :goto_0

    :sswitch_4
    const-string v1, "verify_follow"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_5

    goto :goto_0

    :cond_5
    const/4 v2, 0x2

    goto :goto_0

    :sswitch_5
    const-string v1, "follow"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_6

    goto :goto_0

    :cond_6
    const/4 v2, 0x1

    goto :goto_0

    :sswitch_6
    const-string v1, "verify_like"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_7

    goto :goto_0

    :cond_7
    const/4 v2, 0x0

    :goto_0
    packed-switch v2, :pswitch_data_0

    goto :goto_1

    .line 881
    :pswitch_0
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokLoginResult(Ljava/lang/String;)V

    goto :goto_1

    .line 880
    :pswitch_1
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokPageScanResult(Ljava/lang/String;)V

    goto :goto_1

    .line 879
    :pswitch_2
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokWaitBtnResult(Ljava/lang/String;)V

    goto :goto_1

    .line 882
    :pswitch_3
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokLikeResult(Ljava/lang/String;)V

    goto :goto_1

    .line 885
    :pswitch_4
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokVerifyFollowResult(Ljava/lang/String;)V

    goto :goto_1

    .line 884
    :pswitch_5
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokFollowResult(Ljava/lang/String;)V

    goto :goto_1

    .line 883
    :pswitch_6
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handleTikTokVerifyLikeResult(Ljava/lang/String;)V

    :goto_1
    return-void

    nop

    :sswitch_data_0
    .sparse-switch
        -0x7423bc63 -> :sswitch_6
        -0x4ba2c44f -> :sswitch_5
        -0x40e19c9 -> :sswitch_4
        0x32af97 -> :sswitch_3
        0xea47c92 -> :sswitch_2
        0x34ae5e2d -> :sswitch_1
        0x41d85172 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_6
        :pswitch_5
        :pswitch_4
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private handleTikTokLikeResult(Ljava/lang/String;)V
    .locals 7

    .line 952
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    const/4 v1, 0x5

    const/4 v2, 0x0

    const/4 v3, 0x1

    const/4 v4, -0x1

    sparse-switch v0, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v0, "not_found"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/4 v4, 0x5

    goto :goto_0

    :sswitch_1
    const-string v0, "video_double_clicked"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v4, 0x4

    goto :goto_0

    :sswitch_2
    const-string v0, "clicked"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_0

    :cond_2
    const/4 v4, 0x3

    goto :goto_0

    :sswitch_3
    const-string v0, "video_not_visible"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    goto :goto_0

    :cond_3
    const/4 v4, 0x2

    goto :goto_0

    :sswitch_4
    const-string v0, "video_not_found"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_4

    goto :goto_0

    :cond_4
    const/4 v4, 0x1

    goto :goto_0

    :sswitch_5
    const-string v0, "already_liked"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_5

    goto :goto_0

    :cond_5
    const/4 v4, 0x0

    .line 988
    :goto_0
    const-string v0, "Cible introuvable..."

    const-wide/16 v5, 0x320

    packed-switch v4, :pswitch_data_0

    iget p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    if-ge p1, v1, :cond_6

    .line 989
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda12;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda12;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0, v5, v6}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_1

    .line 991
    :cond_6
    iput-boolean v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 992
    const-string p1, "Cible introuvable, capture..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 993
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->triggerTikTokCaptureFlow()V

    goto :goto_1

    .line 975
    :pswitch_0
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->isLoginButtonVisible(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_7

    .line 976
    iput-boolean v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 977
    const-string p1, "Compte TikTok d\u00e9connect\u00e9"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 978
    new-instance p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;

    const-string v0, "NOT_LOGGED_IN"

    const-string v1, "TikTok d\u00e9connect\u00e9"

    invoke-direct {p1, v2, v0, v1}, Lcom/prsocial/app/InstagramActionClient$ActionResult;-><init>(ZLjava/lang/String;Ljava/lang/String;)V

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    goto :goto_1

    .line 981
    :cond_7
    iput-boolean v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 982
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 983
    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 984
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_1

    .line 961
    :pswitch_1
    iput-boolean v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    .line 962
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda10;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda10;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0, v5, v6}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_1

    .line 969
    :pswitch_2
    iput-boolean v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 970
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 971
    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 972
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_1

    .line 954
    :pswitch_3
    iput-boolean v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 955
    const-string p1, "Like r\u00e9ussi !"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 956
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->triggerTikTokCaptureFlow()V

    :goto_1
    return-void

    nop

    :sswitch_data_0
    .sparse-switch
        -0x47a24afa -> :sswitch_5
        -0x25eb13ae -> :sswitch_4
        -0x136caebe -> :sswitch_3
        0x334a9027 -> :sswitch_2
        0x592cc5fd -> :sswitch_1
        0x604afb16 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_2
        :pswitch_1
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private handleTikTokLoginResult(Ljava/lang/String;)V
    .locals 5

    .line 892
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->resetWatchdog()V

    .line 893
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    const-string v0, "unknown"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v1, "logged_out"

    const/4 v2, 0x0

    if-nez v0, :cond_0

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 921
    iput v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    .line 922
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->performTikTokAction()V

    goto :goto_0

    .line 897
    :cond_0
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    const/4 v3, 0x3

    const/4 v4, 0x1

    if-ge v0, v3, :cond_1

    add-int/2addr v0, v4

    .line 898
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    .line 899
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 900
    iput v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    const/4 p1, 0x0

    .line 901
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 902
    const-string p1, ""

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokLastDomSnap:Ljava/lang/String;

    .line 903
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda27;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda27;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x5dc

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 908
    :cond_1
    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_2

    .line 909
    iput v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    .line 910
    iput-boolean v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 911
    const-string p1, "Compte TikTok d\u00e9connect\u00e9"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 912
    new-instance p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;

    const-string v0, "NOT_LOGGED_IN"

    const-string v1, "TikTok d\u00e9connect\u00e9"

    invoke-direct {p1, v2, v0, v1}, Lcom/prsocial/app/InstagramActionClient$ActionResult;-><init>(ZLjava/lang/String;Ljava/lang/String;)V

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    goto :goto_0

    .line 915
    :cond_2
    iput v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    .line 916
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->performTikTokAction()V

    :goto_0
    return-void
.end method

.method private handleTikTokPageScanResult(Ljava/lang/String;)V
    .locals 14

    .line 776
    const-string v0, "page_scan_txt|"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    const-wide/16 v1, 0x5dc

    const-wide/16 v3, 0x3e8

    const-string v5, "FOLLOW"

    const-string v6, "Contenu introuvable..."

    const-string v7, "CHALLENGE"

    const-string v8, "captcha"

    const-string v9, "unavailable"

    const-string v10, "Captcha TikTok d\u00e9tect\u00e9"

    const/4 v11, 0x0

    const/4 v12, 0x1

    if-eqz v0, :cond_8

    const/16 v0, 0xe

    .line 777
    invoke-virtual {p1, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p1

    .line 779
    invoke-virtual {p1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object p1

    .line 780
    const-string v0, "glisser"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "curseur"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "puzzle"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    .line 781
    invoke-virtual {p1, v8}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "slide"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "drag"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "verification"

    .line 782
    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "security check"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_0

    goto/16 :goto_2

    .line 787
    :cond_0
    const-string v0, "indisponible"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_5

    invoke-virtual {p1, v9}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_5

    const-string v0, "not available"

    .line 788
    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_5

    const-string v0, "deleted"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_5

    const-string v0, "supprim"

    .line 789
    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_1

    goto :goto_1

    .line 794
    :cond_1
    const-string v0, "introuvable"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_4

    const-string v0, "not found"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_4

    const-string v0, "account unavailable"

    .line 795
    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-nez v0, :cond_4

    const-string v0, "page not found"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_2

    goto :goto_0

    .line 802
    :cond_2
    iget-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    if-eqz p1, :cond_7

    .line 803
    iput-boolean v11, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    .line 804
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v5, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_3

    .line 805
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda22;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda22;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_3

    .line 810
    :cond_3
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda33;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda33;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_3

    .line 796
    :cond_4
    :goto_0
    iput-boolean v12, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 797
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 798
    const-string p1, "Compte introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 799
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_3

    .line 790
    :cond_5
    :goto_1
    iput-boolean v12, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 791
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 792
    invoke-direct {p0, v6}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 793
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_3

    .line 783
    :cond_6
    :goto_2
    iput-boolean v12, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 784
    invoke-direct {p0, v10}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 785
    new-instance p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;

    invoke-direct {p1, v11, v7, v10}, Lcom/prsocial/app/InstagramActionClient$ActionResult;-><init>(ZLjava/lang/String;Ljava/lang/String;)V

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    :cond_7
    :goto_3
    return-void

    .line 821
    :cond_8
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    const/4 v13, -0x1

    sparse-switch v0, :sswitch_data_0

    goto :goto_4

    :sswitch_0
    const-string v0, "not_found"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_9

    goto :goto_4

    :cond_9
    const/4 v13, 0x2

    goto :goto_4

    :sswitch_1
    invoke-virtual {p1, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_a

    goto :goto_4

    :cond_a
    const/4 v13, 0x1

    goto :goto_4

    :sswitch_2
    invoke-virtual {p1, v9}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_b

    goto :goto_4

    :cond_b
    const/4 v13, 0x0

    :goto_4
    packed-switch v13, :pswitch_data_0

    .line 836
    iget-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    if-eqz p1, :cond_d

    .line 837
    iput-boolean v11, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    .line 838
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v5, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_c

    .line 839
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda41;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda41;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_5

    .line 844
    :cond_c
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda42;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda42;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_5

    .line 823
    :pswitch_0
    iput-boolean v12, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 824
    invoke-direct {p0, v10}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    .line 825
    new-instance p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;

    invoke-direct {p1, v11, v7, v10}, Lcom/prsocial/app/InstagramActionClient$ActionResult;-><init>(ZLjava/lang/String;Ljava/lang/String;)V

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    goto :goto_5

    .line 830
    :pswitch_1
    iput-boolean v12, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 831
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 832
    invoke-direct {p0, v6}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 833
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    :cond_d
    :goto_5
    return-void

    nop

    :sswitch_data_0
    .sparse-switch
        -0x27aa27b0 -> :sswitch_2
        0x20ef827a -> :sswitch_1
        0x604afb16 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_1
        :pswitch_0
        :pswitch_1
    .end packed-switch
.end method

.method private handleTikTokVerifyFollowResult(Ljava/lang/String;)V
    .locals 3

    .line 1082
    const-string v0, "\\|"

    const/4 v1, -0x1

    invoke-virtual {p1, v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;I)[Ljava/lang/String;

    move-result-object v0

    .line 1083
    array-length v1, v0

    if-lez v1, :cond_0

    const/4 p1, 0x0

    aget-object p1, v0, p1

    .line 1084
    :cond_0
    const-string v0, "confirmed"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    const/4 v0, 0x1

    if-eqz p1, :cond_1

    .line 1085
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1086
    const-string p1, "Follow r\u00e9ussi !"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1087
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->triggerTikTokCaptureFlow()V

    goto :goto_0

    .line 1090
    :cond_1
    iget p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    const/4 v1, 0x5

    if-ge p1, v1, :cond_2

    .line 1091
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda26;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda26;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x5dc

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 1093
    :cond_2
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1094
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1095
    const-string p1, "Cible introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1096
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    :goto_0
    return-void
.end method

.method private handleTikTokVerifyLikeResult(Ljava/lang/String;)V
    .locals 3

    .line 999
    const-string v0, "confirmed"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const/4 v1, 0x1

    if-eqz v0, :cond_0

    .line 1000
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1001
    const-string p1, "Like r\u00e9ussi !"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1002
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->triggerTikTokCaptureFlow()V

    goto :goto_0

    .line 1003
    :cond_0
    const-string v0, "not_found"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    .line 1004
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1005
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1006
    const-string p1, "Cible introuvable..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1007
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    goto :goto_0

    .line 1010
    :cond_1
    iget p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    const/4 v0, 0x5

    if-ge p1, v0, :cond_2

    .line 1011
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda12;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda12;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x3e8

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 1013
    :cond_2
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1014
    const-string p1, "Cible introuvable, capture..."

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1015
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->triggerTikTokCaptureFlow()V

    :goto_0
    return-void
.end method

.method private handleTikTokWaitBtnResult(Ljava/lang/String;)V
    .locals 1

    .line 766
    const-string v0, "btn_ready"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_0

    .line 767
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startTikTokActionSequence()V

    goto :goto_0

    .line 770
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->scheduleTikTokDomPoll()V

    :goto_0
    return-void
.end method

.method private injectTelegramMutationObserver()V
    .locals 2

    .line 614
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->isOpen()Z

    move-result v0

    if-eqz v0, :cond_0

    .line 615
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const-string v1, "javascript:(function(){if(window.__tgObserverActive)return;window.__tgObserverActive=true;window.__tgDomState={lastMutationAt:Date.now(),mutationCount:0,startedAt:Date.now()};var obs=new MutationObserver(function(muts){  window.__tgDomState.lastMutationAt=Date.now();  window.__tgDomState.mutationCount+=muts.length;});obs.observe(document.documentElement,{childList:true,subtree:true,attributes:false,characterData:false});window.__tgObserverRef=obs;})();"

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    :cond_0
    return-void
.end method

.method private injectWebGLFixScript()V
    .locals 2

    .line 487
    const-string v0, "javascript:(function() {if (window.__prsWebGLFixed) return;window.__prsWebGLFixed = true;try {  var origShaderSource = WebGLRenderingContext.prototype.shaderSource;  WebGLRenderingContext.prototype.shaderSource = function(shader, source) {    if (typeof source === \'string\') {      source = source        .replace(/#extension\\\\s+GL_EXT_frag_depth\\\\s*:[^\\\\n]+/g, \'// disabled: not supported on Firefox Android\\\\n\')        .replace(/#extension\\\\s+GL_EXT_shader_texture_lod\\\\s*:[^\\\\n]+/g, \'// disabled: not supported on Firefox Android\\\\n\')        .replace(/#extension\\\\s+GL_EXT_draw_buffers\\\\s*:[^\\\\n]+/g, \'// disabled: not supported on Firefox Android\\\\n\')        .replace(/#extension\\\\s+EXT_frag_depth\\\\s*:[^\\\\n]+/g, \'// disabled: not supported on Firefox Android\\\\n\')        .replace(/#extension\\\\s+EXT_shader_texture_lod\\\\s*:[^\\\\n]+/g, \'// disabled: not supported on Firefox Android\\\\n\');    }    return origShaderSource.call(this, shader, source);};  var origGetExt = WebGLRenderingContext.prototype.getExtension;  WebGLRenderingContext.prototype.getExtension = function(name) {    if (name && (name.indexOf(\'EXT_frag_depth\') > -1 || name.indexOf(\'EXT_shader_texture_lod\') > -1 || name.indexOf(\'EXT_draw_buffers\') > -1 || name.indexOf(\'WEBGL_draw_buffers\') > -1)) {      return null;    }    return origGetExt.call(this, name);};} catch(e) {  console.log(\'[PRSocial] WebGL fix error:\', e);} })();"

    .line 513
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v1, v0}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    return-void
.end method

.method private isCriticalAccountState(Ljava/lang/String;)Z
    .locals 4

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1662
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, 0x1

    const/4 v3, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "NO_SESSION"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v3, 0x5

    goto :goto_0

    :sswitch_1
    const-string v1, "SUSPENDED"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v3, 0x4

    goto :goto_0

    :sswitch_2
    const-string v1, "DISABLED"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v3, 0x3

    goto :goto_0

    :sswitch_3
    const-string v1, "CHALLENGE"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_4

    goto :goto_0

    :cond_4
    const/4 v3, 0x2

    goto :goto_0

    :sswitch_4
    const-string v1, "RATE_LIMIT"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_5

    goto :goto_0

    :cond_5
    const/4 v3, 0x1

    goto :goto_0

    :sswitch_5
    const-string v1, "NOT_LOGGED_IN"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_6

    goto :goto_0

    :cond_6
    const/4 v3, 0x0

    :goto_0
    packed-switch v3, :pswitch_data_0

    return v0

    :pswitch_0
    return v2

    nop

    :sswitch_data_0
    .sparse-switch
        -0x36395d8a -> :sswitch_5
        -0x1cbb2c84 -> :sswitch_4
        -0x64d73bd -> :sswitch_3
        0x3ecc2a7c -> :sswitch_2
        0x430d9dbb -> :sswitch_1
        0x5d2a6df8 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_0
        :pswitch_0
        :pswitch_0
        :pswitch_0
        :pswitch_0
        :pswitch_0
    .end packed-switch
.end method

.method private isDomReadyForAction(Ljava/lang/String;)Z
    .locals 5

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 856
    :cond_0
    const-string v1, "FOLLOW"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    const-string v2, "user-page"

    const/4 v3, 0x1

    if-eqz v1, :cond_2

    .line 857
    invoke-virtual {p1, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_1

    const-string v1, "user-title"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_1

    const/4 v0, 0x1

    :cond_1
    return v0

    .line 858
    :cond_2
    const-string v1, "LIKE"

    iget-object v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v1, v4}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    const-string v4, "browse-video"

    if-eqz v1, :cond_5

    .line 859
    invoke-virtual {p1, v4}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "video-player"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "like-icon"

    .line 860
    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "browse-like-icon"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_4

    :cond_3
    const/4 v0, 0x1

    :cond_4
    return v0

    .line 862
    :cond_5
    invoke-virtual {p1, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_6

    invoke-virtual {p1, v4}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_7

    :cond_6
    const/4 v0, 0x1

    :cond_7
    return v0
.end method

.method private isLoginButtonVisible(Ljava/lang/String;)Z
    .locals 2

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1024
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object p1

    .line 1025
    const-string v1, "se connecter"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_1

    const-string v1, "log in"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_1

    const-string v1, "sign in"

    .line 1026
    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_1

    const-string v1, "connexion"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_1

    const-string v1, "\u767b\u5f55"

    .line 1027
    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_2

    :cond_1
    const/4 v0, 0x1

    :cond_2
    return v0
.end method

.method private isReadyVisualPage(Ljava/lang/String;)Z
    .locals 2

    const/4 v0, 0x0

    if-eqz p1, :cond_2

    .line 231
    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_0

    .line 232
    :cond_0
    sget-object v1, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p1, v1}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p1

    .line 233
    const-string v1, "about:"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_2

    const-string v1, "prsocial:"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_2

    const-string v1, "http://"

    .line 234
    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_1

    const-string v1, "https://"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_2

    :cond_1
    const/4 v0, 0x1

    :cond_2
    :goto_0
    return v0
.end method

.method private isSameDomainAsTask(Ljava/lang/String;)Z
    .locals 5

    .line 1246
    const-string v0, ""

    const-string v1, "^www\\."

    .line 0
    const-string v2, "."

    const/4 v3, 0x1

    if-eqz p1, :cond_3

    .line 1246
    iget-object v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    if-nez v4, :cond_0

    goto :goto_0

    .line 1248
    :cond_0
    :try_start_0
    invoke-static {v4}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v4

    invoke-virtual {v4}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v4

    .line 1249
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    invoke-virtual {p1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object p1

    if-eqz v4, :cond_3

    if-nez p1, :cond_1

    goto :goto_0

    .line 1252
    :cond_1
    invoke-virtual {v4, v1, v0}, Ljava/lang/String;->replaceFirst(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 1253
    invoke-virtual {p1, v1, v0}, Ljava/lang/String;->replaceFirst(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 1255
    invoke-virtual {p1, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result p1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    if-eqz p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v3, 0x0

    :catch_0
    :cond_3
    :goto_0
    return v3
.end method

.method private isTargetUnavailableState(Ljava/lang/String;)Z
    .locals 4

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1652
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, 0x1

    const/4 v3, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "ENDPOINT_NOT_FOUND"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v3, 0x3

    goto :goto_0

    :sswitch_1
    const-string v1, "INVALID_URL"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v3, 0x2

    goto :goto_0

    :sswitch_2
    const-string v1, "INVALID_TARGET"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v3, 0x1

    goto :goto_0

    :sswitch_3
    const-string v1, "RESOLVE_FAILED"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_4

    goto :goto_0

    :cond_4
    const/4 v3, 0x0

    :goto_0
    packed-switch v3, :pswitch_data_0

    return v0

    :pswitch_0
    return v2

    nop

    :sswitch_data_0
    .sparse-switch
        -0x7b6365f0 -> :sswitch_3
        0x118bf4f9 -> :sswitch_2
        0x479732e7 -> :sswitch_1
        0x5c9bf0ac -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_0
        :pswitch_0
        :pswitch_0
        :pswitch_0
    .end packed-switch
.end method

.method private isWrongUrl(Ljava/lang/String;)Z
    .locals 3

    const/4 v0, 0x0

    if-eqz p1, :cond_4

    .line 1594
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    if-nez v1, :cond_0

    goto :goto_0

    .line 1598
    :cond_0
    :try_start_0
    invoke-static {v1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    .line 1599
    invoke-virtual {v1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_2

    .line 1600
    const-string v2, "vt.tiktok.com"

    .line 1601
    invoke-virtual {v1, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-nez v2, :cond_1

    const-string v2, "vm.tiktok.com"

    .line 1602
    invoke-virtual {v1, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-nez v2, :cond_1

    const-string v2, "youtu.be"

    .line 1603
    invoke-virtual {v1, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    if-eqz v1, :cond_2

    :cond_1
    return v0

    :catch_0
    nop

    .line 1608
    :cond_2
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->extractUrlId(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_4

    .line 1609
    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-eqz v2, :cond_3

    goto :goto_0

    .line 1611
    :cond_3
    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    xor-int/lit8 p1, p1, 0x1

    return p1

    :cond_4
    :goto_0
    return v0
.end method

.method static synthetic lambda$captureVisibleViewport$39(Lcom/prsocial/app/TaskWebViewActivity$onCapture;Landroid/graphics/Bitmap;)V
    .locals 2

    if-nez p1, :cond_0

    const/4 p1, 0x0

    .line 1484
    invoke-interface {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$onCapture;->onCapture(Landroid/graphics/Bitmap;)V

    return-void

    .line 1487
    :cond_0
    sget-object v0, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroid/graphics/Bitmap;->copy(Landroid/graphics/Bitmap$Config;Z)Landroid/graphics/Bitmap;

    move-result-object p1

    invoke-interface {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$onCapture;->onCapture(Landroid/graphics/Bitmap;)V

    return-void
.end method

.method private loadPageForScreenshot()V
    .locals 1

    .line 425
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda25;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda25;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private loadUrlFromInput()V
    .locals 2

    .line 203
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->urlInput:Lcom/google/android/material/textfield/TextInputEditText;

    invoke-virtual {v0}, Lcom/google/android/material/textfield/TextInputEditText;->getText()Landroid/text/Editable;

    move-result-object v0

    if-nez v0, :cond_0

    const-string v0, ""

    goto :goto_0

    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->urlInput:Lcom/google/android/material/textfield/TextInputEditText;

    invoke-virtual {v0}, Lcom/google/android/material/textfield/TextInputEditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    .line 204
    :goto_0
    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_1

    return-void

    .line 205
    :cond_1
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->normalizeUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    return-void
.end method

.method private normalizeUrl(Ljava/lang/String;)Ljava/lang/String;
    .locals 4

    const-string v0, "https://www.youtube.com/watch?v="

    if-nez p1, :cond_0

    .line 209
    const-string p1, ""

    goto :goto_0

    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p1

    .line 210
    :goto_0
    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_1

    const-string p1, "https://google.com"

    return-object p1

    .line 211
    :cond_1
    const-string v1, "http://"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "https://"

    invoke-virtual {p1, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_2

    goto :goto_1

    .line 226
    :cond_2
    const-string v0, "."

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_3

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    return-object p1

    .line 227
    :cond_3
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "https://www.google.com/search?q="

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {p1}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    return-object p1

    .line 214
    :cond_4
    :goto_1
    :try_start_0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    .line 215
    invoke-virtual {v1}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v2

    if-eqz v2, :cond_5

    .line 216
    const-string v3, "youtu.be"

    invoke-virtual {v2, v3}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-eqz v2, :cond_5

    .line 217
    invoke-virtual {v1}, Landroid/net/Uri;->getPath()Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_5

    .line 218
    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v2

    const/4 v3, 0x1

    if-le v2, v3, :cond_5

    .line 219
    invoke-virtual {v1, v3}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v1

    const-string v2, "/"

    invoke-virtual {v1, v2}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x0

    aget-object v1, v1, v2

    .line 220
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :catch_0
    :cond_5
    return-object p1
.end method

.method private onPageLoadedForAutoSubmit()V
    .locals 3

    .line 532
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->resetWatchdog()V

    .line 533
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->httpActionAlreadyDone:Z

    const/4 v1, 0x0

    if-eqz v0, :cond_1

    .line 534
    const-string v0, "\ud83d\udcf8 Capture en cours..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    const/4 v0, 0x1

    .line 535
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 536
    iput v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    .line 537
    iput v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastProgress:I

    .line 538
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 539
    const-string v0, "telegram"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 543
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_5

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->normalizeUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    goto :goto_1

    .line 546
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_5

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->normalizeUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    goto :goto_1

    .line 549
    :cond_1
    const-string v0, "Mode auto: tentative d\'action..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 550
    const-string v0, "LIKE"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_3

    const-string v0, "FOLLOW"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2

    goto :goto_0

    .line 551
    :cond_2
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void

    .line 553
    :cond_3
    :goto_0
    const-string v0, "tiktok"

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4

    .line 554
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 555
    iput v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    .line 556
    iput v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokSessionReloads:I

    const/4 v0, 0x0

    .line 557
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 558
    const-string v0, ""

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokLastDomSnap:Ljava/lang/String;

    .line 559
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPrevDomSnap:Ljava/lang/String;

    .line 560
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokScanAfterClick:Z

    .line 561
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startTikTokDomPolling()V

    goto :goto_1

    .line 563
    :cond_4
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->performActionViaHttp(Ljava/lang/String;)V

    :cond_5
    :goto_1
    return-void
.end method

.method private onPageStoppedAndReady()V
    .locals 2

    .line 517
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    const/4 v1, 0x1

    add-int/2addr v0, v1

    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageStopCountSinceReload:I

    .line 518
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoMode:Z

    if-eqz v0, :cond_0

    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->lastSeenUrl:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->isReadyVisualPage(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    const/4 v0, 0x0

    .line 519
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 520
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    goto :goto_0

    .line 521
    :cond_0
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageLoadHandled:Z

    if-nez v0, :cond_2

    .line 522
    iput-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageLoadHandled:Z

    .line 523
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoMode:Z

    if-eqz v0, :cond_1

    .line 524
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->onPageLoadedForAutoSubmit()V

    goto :goto_0

    .line 526
    :cond_1
    const-string v0, "Mode manuel: faites l\'action puis Capture + Soumettre"

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    :cond_2
    :goto_0
    return-void
.end method

.method private openExternal(Ljava/lang/String;)V
    .locals 2

    .line 1589
    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.intent.action.VIEW"

    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    invoke-direct {v0, v1, p1}, Landroid/content/Intent;-><init>(Ljava/lang/String;Landroid/net/Uri;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :catch_0
    return-void
.end method

.method private performActionViaHttp(Ljava/lang/String;)V
    .locals 2

    .line 1134
    const-string v0, "Action automatique HTTP en cours..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1135
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    if-nez v0, :cond_0

    const-string v0, ""

    .line 1136
    :cond_0
    const-string v1, "threads"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    .line 1137
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda38;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda38;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {p0, v0, p1, v1}, Lcom/prsocial/app/ThreadsActionClient;->performAction(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ThreadsActionClient$ResultCallback;)V

    goto :goto_0

    .line 1139
    :cond_1
    const-string v1, "youtube"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_2

    .line 1140
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda39;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda39;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {p0, v0, p1, v1}, Lcom/prsocial/app/YouTubeActionClient;->performAction(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/YouTubeActionClient$ResultCallback;)V

    goto :goto_0

    .line 1143
    :cond_2
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda40;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda40;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {p0, v0, p1, v1}, Lcom/prsocial/app/InstagramActionClient;->performAction(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ResultCallback;)V

    :goto_0
    return-void
.end method

.method private performTikTokAction()V
    .locals 2

    .line 930
    const-string v0, "LIKE"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->performTikTokLike()V

    goto :goto_0

    .line 931
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->performTikTokFollow()V

    :goto_0
    return-void
.end method

.method private performTikTokFollow()V
    .locals 3

    .line 1031
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    const/4 v1, 0x5

    const/4 v2, 0x1

    if-lt v0, v1, :cond_0

    .line 1032
    iput-boolean v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 1033
    const-string v0, "Cible introuvable..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1034
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    return-void

    :cond_0
    add-int/2addr v0, v2

    .line 1037
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    .line 1038
    const-string v0, "Action en cours..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1039
    const-string v0, "follow"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 1040
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildClickFollowJS()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method private performTikTokLike()V
    .locals 3

    .line 935
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    const/4 v1, 0x5

    const/4 v2, 0x1

    if-lt v0, v1, :cond_0

    .line 936
    iput-boolean v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 937
    const-string v0, "Cible introuvable..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 938
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    return-void

    :cond_0
    add-int/2addr v0, v2

    .line 941
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    .line 942
    const-string v0, "Action en cours..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 943
    const-string v0, "like"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 944
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionAttempts:I

    if-ne v0, v2, :cond_1

    .line 945
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const-string v1, "(function() {  var target = null;  var vid = document.querySelector(\'video\');  if (vid) {    var p = vid.parentElement;    for (var i = 0; i < 4 && p; i++) {      var st = window.getComputedStyle(p);      if (st.position !== \'static\' || p.getAttribute(\'role\') === \'button\') {        target = p; break;      }      p = p.parentElement;    }    if (!target) target = vid;  }  if (!target) {    var sel = [\'[data-e2e=\"browse-video\"]\',\'[data-e2e=\"video-player\"]\',\'[data-e2e=\"feed-video\"]\'];    for (var s = 0; s < sel.length; s++) {      var el = document.querySelector(sel[s]);      if (el) { target = el; break; }    }  }  if (!target) { alert(\'TGAPP|video_not_found\'); return; }  var rect = target.getBoundingClientRect();  if (rect.width === 0 || rect.height === 0) { alert(\'TGAPP|video_not_visible\'); return; }  var cx = rect.left + rect.width / 2;  var cy = rect.top + rect.height / 2;  function mkPtr(type, detail) {    return new PointerEvent(type, {bubbles:true,cancelable:true,view:window,      clientX:cx,clientY:cy,screenX:cx,screenY:cy,      pointerId:1,pointerType:\'touch\',isPrimary:true,detail:detail||0});  }  function mkMouse(type, detail) {    return new MouseEvent(type, {bubbles:true,cancelable:true,view:window,      clientX:cx,clientY:cy,screenX:cx,screenY:cy,detail:detail||1});  }  target.dispatchEvent(mkPtr(\'pointerdown\',1));  target.dispatchEvent(mkMouse(\'mousedown\',1));  target.dispatchEvent(mkPtr(\'pointerup\',1));  target.dispatchEvent(mkMouse(\'mouseup\',1));  target.dispatchEvent(mkMouse(\'click\',1));  setTimeout(function() {    target.dispatchEvent(mkPtr(\'pointerdown\',2));    target.dispatchEvent(mkMouse(\'mousedown\',2));    target.dispatchEvent(mkPtr(\'pointerup\',2));    target.dispatchEvent(mkMouse(\'mouseup\',2));    target.dispatchEvent(mkMouse(\'click\',2));    target.dispatchEvent(new MouseEvent(\'dblclick\',{bubbles:true,cancelable:true,      view:window,clientX:cx,clientY:cy,screenX:cx,screenY:cy,detail:2}));    alert(\'TGAPP|video_double_clicked\');  }, 200);})();"

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    goto :goto_0

    .line 947
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildClickLikeJS()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    :goto_0
    return-void
.end method

.method private pollTelegramDom()V
    .locals 5

    .line 628
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-nez v0, :cond_2

    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    if-nez v0, :cond_0

    goto :goto_0

    .line 629
    :cond_0
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    iget-wide v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollStart:J

    sub-long/2addr v0, v2

    const-wide/16 v2, 0x7530

    cmp-long v4, v0, v2

    if-lez v4, :cond_1

    .line 631
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "Telegram DOM poll timeout apr\u00e8s "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0, v1}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    const-string v0, "ms, capture forc\u00e9e"

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "PRSocial_TaskFlow"

    invoke-static {v1, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 632
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTelegramDomPolling()V

    const/4 v0, 0x0

    .line 633
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    .line 634
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void

    .line 637
    :cond_1
    iget v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRound:I

    add-int/lit8 v0, v0, 0x1

    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRound:I

    .line 665
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_2

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->isOpen()Z

    move-result v0

    if-eqz v0, :cond_2

    .line 666
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const-string v1, "javascript:(function(){try{var titleFound=false;var TITLE_SEL=[\'.peer-title\',\'.top .title\',\'.chat-info .title\',\'.ChatInfo .title\',\'.info .title\'];for(var i=0;i<TITLE_SEL.length;i++){  var els=document.querySelectorAll(TITLE_SEL[i]);  for(var k=0;k<els.length;k++){    var r=els[k].getBoundingClientRect();    if(r.width>0&&r.height>0){titleFound=true;break;}  }  if(titleFound)break;}var contentFound=false;var CONTENT_SEL=[\'.bubbles-inner .bubble\',\'.bubbles .bubble\',\'.chat-input-main\',\'.reply-markup-rows\'];for(var j=0;j<CONTENT_SEL.length;j++){  var ce=document.querySelector(CONTENT_SEL[j]);  if(ce){var cr=ce.getBoundingClientRect();if(cr.width>10&&cr.height>10){contentFound=true;break;}}}if(titleFound&&contentFound){alert(\'TGWEB|1\');return;}var st=window.__tgDomState;if(st){  var sinceLastMut=Date.now()-st.lastMutationAt;  if(sinceLastMut>=2500){alert(\'TGWEB|settled\');return;}  alert(\'TGWEB|waiting:\'+sinceLastMut+\':\'+(st.mutationCount||0)+\':\'+titleFound+\':\'+contentFound);}else{alert(\'TGWEB|no_observer\');}}catch(e){alert(\'TGWEB|err:\'+e.message);}})();"

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    :cond_2
    :goto_0
    return-void
.end method

.method private pollTikTokButton()V
    .locals 5

    .line 726
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    if-eqz v0, :cond_0

    return-void

    .line 728
    :cond_0
    const-string v0, "page_scan"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    const/4 v0, 0x0

    .line 729
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 731
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    if-eqz v0, :cond_2

    return-void

    .line 732
    :cond_2
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    iget-wide v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollStart:J

    sub-long/2addr v0, v2

    const-wide/16 v2, 0x4e20

    cmp-long v4, v0, v2

    if-lez v4, :cond_3

    const/4 v0, 0x1

    .line 735
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    .line 736
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 737
    const-string v0, "Cible introuvable..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 738
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->reportTaskAndFinish()V

    return-void

    .line 741
    :cond_3
    const-string v0, "wait_btn"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 742
    const-string v0, "FOLLOW"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4

    .line 743
    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildWaitForFollowButtonJS()Ljava/lang/String;

    move-result-object v0

    goto :goto_0

    .line 744
    :cond_4
    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildWaitForLikeButtonJS()Ljava/lang/String;

    move-result-object v0

    .line 745
    :goto_0
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {v1, v0}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method private reinjectWebGLFix()V
    .locals 0

    .line 478
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->applyWebGLFix()V

    return-void
.end method

.method private reportTaskAndFinish()V
    .locals 3

    const/4 v0, 0x1

    .line 1103
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 1104
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelWatchdog()V

    .line 1105
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1106
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda37;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda37;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    .line 1107
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    new-instance v2, Lcom/prsocial/app/TaskWebViewActivity$7;

    invoke-direct {v2, p0}, Lcom/prsocial/app/TaskWebViewActivity$7;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {v0, v1, v2}, Lcom/prsocial/app/ApiClient;->reportTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private resetWatchdog()V
    .locals 0

    .line 1388
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelWatchdog()V

    .line 1389
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startWatchdog()V

    return-void
.end method

.method private saveBitmapToFile(Landroid/graphics/Bitmap;)Ljava/io/File;
    .locals 9

    .line 1496
    :try_start_0
    sget-object v0, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    const/4 v1, 0x1

    invoke-virtual {p1, v0, v1}, Landroid/graphics/Bitmap;->copy(Landroid/graphics/Bitmap$Config;Z)Landroid/graphics/Bitmap;

    move-result-object p1

    .line 1497
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    .line 1499
    invoke-virtual {p1}, Landroid/graphics/Bitmap;->getHeight()I

    move-result v0

    sub-int/2addr v0, v1

    .line 1500
    invoke-virtual {p1}, Landroid/graphics/Bitmap;->getWidth()I

    move-result v1

    const/4 v4, 0x0

    :goto_0
    const/16 v5, 0x8

    if-ge v4, v5, :cond_0

    if-ge v4, v1, :cond_0

    mul-int/lit8 v5, v4, 0x8

    shr-long v5, v2, v5

    const-wide/16 v7, 0xff

    and-long/2addr v5, v7

    long-to-int v6, v5

    add-int/lit8 v5, v1, -0x1

    sub-int/2addr v5, v4

    const/16 v7, 0xff

    .line 1504
    invoke-static {v7, v6, v6, v6}, Landroid/graphics/Color;->argb(IIII)I

    move-result v6

    invoke-virtual {p1, v5, v0, v6}, Landroid/graphics/Bitmap;->setPixel(III)V

    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    .line 1506
    :cond_0
    const-string v0, "ss_"

    const-string v1, ".png"

    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getCacheDir()Ljava/io/File;

    move-result-object v2

    invoke-static {v0, v1, v2}, Ljava/io/File;->createTempFile(Ljava/lang/String;Ljava/lang/String;Ljava/io/File;)Ljava/io/File;

    move-result-object v0

    .line 1507
    new-instance v1, Ljava/io/FileOutputStream;

    invoke-direct {v1, v0}, Ljava/io/FileOutputStream;-><init>(Ljava/io/File;)V

    .line 1508
    sget-object v2, Landroid/graphics/Bitmap$CompressFormat;->PNG:Landroid/graphics/Bitmap$CompressFormat;

    const/16 v3, 0x5a

    invoke-virtual {p1, v2, v3, v1}, Landroid/graphics/Bitmap;->compress(Landroid/graphics/Bitmap$CompressFormat;ILjava/io/OutputStream;)Z

    .line 1509
    invoke-virtual {v1}, Ljava/io/FileOutputStream;->flush()V

    .line 1510
    invoke-virtual {v1}, Ljava/io/FileOutputStream;->close()V

    .line 1511
    invoke-virtual {p1}, Landroid/graphics/Bitmap;->recycle()V
    :try_end_0
    .catch Ljava/io/IOException; {:try_start_0 .. :try_end_0} :catch_0

    return-object v0

    :catch_0
    const/4 p1, 0x0

    return-object p1
.end method

.method private scheduleTelegramDomPoll()V
    .locals 4

    .line 672
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda11;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda11;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRunnable:Ljava/lang/Runnable;

    .line 673
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    const-wide/16 v2, 0x190

    invoke-virtual {v1, v0, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private scheduleTikTokDomPoll()V
    .locals 4

    .line 719
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda32;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda32;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    .line 720
    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollRunnable:Ljava/lang/Runnable;

    .line 721
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    const-wide/16 v2, 0x64

    invoke-virtual {v1, v0, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private setupGecko()V
    .locals 2

    .line 238
    new-instance v0, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;

    invoke-direct {v0}, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;-><init>()V

    const/4 v1, 0x0

    .line 239
    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;->useTrackingProtection(Z)Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;

    move-result-object v0

    .line 240
    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;->suspendMediaWhenInactive(Z)Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;

    move-result-object v0

    const/4 v1, 0x1

    .line 241
    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;->userAgentMode(I)Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;

    move-result-object v0

    .line 242
    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;->viewportMode(I)Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;

    move-result-object v0

    .line 243
    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSessionSettings$Builder;->build()Lorg/mozilla/geckoview/GeckoSessionSettings;

    move-result-object v0

    .line 245
    new-instance v1, Lorg/mozilla/geckoview/GeckoSession;

    invoke-direct {v1, v0}, Lorg/mozilla/geckoview/GeckoSession;-><init>(Lorg/mozilla/geckoview/GeckoSessionSettings;)V

    iput-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    .line 246
    invoke-direct {p0, v1}, Lcom/prsocial/app/TaskWebViewActivity;->attachDelegates(Lorg/mozilla/geckoview/GeckoSession;)V

    .line 247
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getApplicationContext()Landroid/content/Context;

    move-result-object v1

    invoke-static {v1}, Lcom/prsocial/app/WebViewActivity;->getOrCreateRuntime(Landroid/content/Context;)Lorg/mozilla/geckoview/GeckoRuntime;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoSession;->open(Lorg/mozilla/geckoview/GeckoRuntime;)V

    .line 248
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->geckoView:Lorg/mozilla/geckoview/GeckoView;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v0, v1}, Lorg/mozilla/geckoview/GeckoView;->setSession(Lorg/mozilla/geckoview/GeckoSession;)V

    return-void
.end method

.method private setupToolbar()V
    .locals 2

    .line 183
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnBack:Landroid/widget/ImageButton;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda5;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda5;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/ImageButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 187
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnForward:Landroid/widget/ImageButton;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda6;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda6;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/ImageButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 188
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnRefresh:Landroid/widget/ImageButton;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda7;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda7;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/ImageButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 190
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->urlInput:Lcom/google/android/material/textfield/TextInputEditText;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda8;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda8;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v0, v1}, Lcom/google/android/material/textfield/TextInputEditText;->setOnEditorActionListener(Landroid/widget/TextView$OnEditorActionListener;)V

    .line 199
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->updateNavigationButtons()V

    return-void
.end method

.method private shouldOpenExternally(Ljava/lang/String;)Z
    .locals 2

    const/4 v0, 0x0

    if-eqz p1, :cond_4

    .line 1573
    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_0

    goto/16 :goto_0

    .line 1574
    :cond_0
    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    invoke-virtual {p1}, Landroid/net/Uri;->getScheme()Ljava/lang/String;

    move-result-object p1

    if-nez p1, :cond_1

    return v0

    .line 1576
    :cond_1
    sget-object v1, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p1, v1}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p1

    .line 1577
    const-string v1, "http"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "https"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "about"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "blob"

    .line 1578
    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "data"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "javascript"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "storagerelay"

    .line 1579
    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, ""

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    goto :goto_0

    .line 1582
    :cond_2
    const-string v1, "intent"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "mailto"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "tel"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "sms"

    .line 1583
    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "smsto"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "geo"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    const-string v1, "market"

    .line 1584
    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_4

    :cond_3
    const/4 v0, 0x1

    :cond_4
    :goto_0
    return v0
.end method

.method private showStatus(Ljava/lang/String;)V
    .locals 1

    .line 1711
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda34;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda34;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private showStatusPersistent(Ljava/lang/String;)V
    .locals 1

    .line 1719
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda30;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda30;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Ljava/lang/String;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private skipTask()V
    .locals 3

    .line 1517
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSkip:Lcom/google/android/material/button/MaterialButton;

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Lcom/google/android/material/button/MaterialButton;->setEnabled(Z)V

    .line 1518
    const-string v0, "Skip..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1519
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    new-instance v2, Lcom/prsocial/app/TaskWebViewActivity$9;

    invoke-direct {v2, p0}, Lcom/prsocial/app/TaskWebViewActivity$9;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {v0, v1, v2}, Lcom/prsocial/app/ApiClient;->cancelTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private startTelegramDomReadyPolling()V
    .locals 2

    .line 587
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-nez v0, :cond_1

    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->awaitingAutoCapture:Z

    if-nez v0, :cond_0

    goto :goto_0

    .line 588
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTelegramDomPolling()V

    .line 589
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    iput-wide v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollStart:J

    const/4 v0, 0x0

    .line 590
    iput v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tgDomPollRound:I

    .line 591
    const-string v0, "Attente contenu Telegram..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 592
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->injectTelegramMutationObserver()V

    .line 593
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->scheduleTelegramDomPoll()V

    :cond_1
    :goto_0
    return-void
.end method

.method private startTikTokActionSequence()V
    .locals 2

    .line 866
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokActionExecuted:Z

    if-eqz v0, :cond_0

    return-void

    .line 867
    :cond_0
    const-string v0, "check_login"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 868
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const-string v1, "var liSelectors=[  \'[data-e2e=\"nav-avatar\"]\',  \'[data-e2e=\"user-avatar\"]\',  \'[data-e2e=\"profile-icon\"]\',  \'[data-e2e=\"upload-icon\"]\',  \'[data-e2e=\"message-icon\"]\',  \'[data-e2e=\"inbox-icon\"]\',  \'[data-e2e=\"nav-upload\"]\',  \'[data-e2e=\"nav-profile\"]\',  \'[data-e2e=\"nav-messages\"]\',  \'[data-e2e=\"nav-activity\"]\',  \'a[href=\"/inbox\"]\'];var li=liSelectors.some(function(s){return document.querySelector(s)!==null;});var lo=[  document.querySelector(\'[data-e2e=\"nav-login-button\"]\'),  document.querySelector(\'a[href*=\"/login\"][data-e2e]\'),  document.querySelector(\'button[class*=\"loginButton\"]\'),  document.querySelector(\'[class*=\"loginButton\"]\')].some(function(el){return el!==null;});if(!li){  var allE2e=Array.from(document.querySelectorAll(\'[data-e2e]\')).map(function(n){return n.getAttribute(\'data-e2e\');});  var loggedInKeys=[\'profile-icon\',\'upload-icon\',\'inbox-icon\',\'nav-upload\',\'nav-profile\',\'nav-messages\',\'nav-activity\',\'user-avatar\',\'nav-avatar\'];  li=loggedInKeys.some(function(k){return allE2e.indexOf(k)!==-1;});}if(li){  var loginTexts=[\'se connecter\',\'log in\',\'sign in\',\'connexion\',\'\u767b\u5f55\'];  var visibleBtns=Array.from(document.querySelectorAll(\'button,[role=\"button\"],a\'));  var hasLoginBtn=visibleBtns.some(function(b){    var rc=b.getBoundingClientRect();    if(rc.width===0||rc.height===0)return false;    var t=(b.textContent||b.innerText||\'\').trim().toLowerCase();    return loginTexts.some(function(lt){return t===lt;});  });  if(hasLoginBtn){li=false;lo=true;}}alert(\'TGAPP|\'+(li?\'logged_in\':(lo?\'logged_out\':\'unknown\')));"

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method private startTikTokDomPolling()V
    .locals 2

    .line 687
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 688
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    iput-wide v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokDomPollStart:J

    .line 689
    const-string v0, "Attente du bouton..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 690
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->scheduleTikTokDomPoll()V

    .line 691
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startTikTokPageScanLoop()V

    return-void
.end method

.method private startTikTokPageScanLoop()V
    .locals 4

    .line 696
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokPageScanLoop()V

    .line 697
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$6;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$6;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPageScanRunnable:Ljava/lang/Runnable;

    .line 708
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    const-wide/16 v2, 0x5dc

    invoke-virtual {v1, v0, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private startWatchdog()V
    .locals 4

    .line 1373
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelWatchdog()V

    .line 1375
    const-string v0, "telegram"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    const-wide/32 v0, 0xafc8

    goto :goto_0

    :cond_0
    const-wide/16 v0, 0x4e20

    .line 1376
    :goto_0
    new-instance v2, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda36;

    invoke-direct {v2, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda36;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    iput-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->watchdogRunnable:Ljava/lang/Runnable;

    .line 1384
    iget-object v3, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    invoke-virtual {v3, v2, v0, v1}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private stopAutomationAndReturnToDashboard(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 7

    .line 1677
    new-instance v0, Lcom/prsocial/app/SessionManager;

    invoke-direct {v0, p0}, Lcom/prsocial/app/SessionManager;-><init>(Landroid/content/Context;)V

    .line 1678
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    const/4 v3, 0x0

    const/4 v4, 0x1

    invoke-virtual {v2, v3, v4}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->toUpperCase()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {v2, v4}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 1680
    iget-object v2, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v2}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v2}, Ljava/lang/String;->hashCode()I

    move-result v5

    const/4 v6, -0x1

    sparse-switch v5, :sswitch_data_0

    :goto_0
    const/4 v4, -0x1

    goto :goto_1

    :sswitch_0
    const-string v4, "NO_SESSION"

    invoke-virtual {v2, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_0

    goto :goto_0

    :cond_0
    const/4 v4, 0x5

    goto :goto_1

    :sswitch_1
    const-string v4, "SUSPENDED"

    invoke-virtual {v2, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_1

    goto :goto_0

    :cond_1
    const/4 v4, 0x4

    goto :goto_1

    :sswitch_2
    const-string v4, "DISABLED"

    invoke-virtual {v2, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_2

    goto :goto_0

    :cond_2
    const/4 v4, 0x3

    goto :goto_1

    :sswitch_3
    const-string v4, "CHALLENGE"

    invoke-virtual {v2, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_3

    goto :goto_0

    :cond_3
    const/4 v4, 0x2

    goto :goto_1

    :sswitch_4
    const-string v5, "RATE_LIMIT"

    invoke-virtual {v2, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_5

    goto :goto_0

    :sswitch_5
    const-string v4, "NOT_LOGGED_IN"

    invoke-virtual {v2, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_4

    goto :goto_0

    :cond_4
    const/4 v4, 0x0

    .line 1693
    :cond_5
    :goto_1
    const-string v2, ": "

    const-string v5, "Compte "

    packed-switch v4, :pswitch_data_0

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "Automatisation stoppee "

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_2

    .line 1685
    :pswitch_0
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " suspendu."

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_2

    .line 1687
    :pswitch_1
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " desactive."

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_2

    .line 1691
    :pswitch_2
    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "Challenge "

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " detecte. Validation requise."

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_2

    .line 1689
    :pswitch_3
    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "Rate limit "

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " detecte. Pause necessaire."

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_2

    .line 1683
    :pswitch_4
    new-instance v4, Ljava/lang/StringBuilder;

    invoke-direct {v4}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " deconnecte. Reconnectez le compte."

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    .line 1696
    :goto_2
    iget-object v4, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    iget-object p1, p1, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v0, v4, p1, v1}, Lcom/prsocial/app/SessionManager;->saveAutomationBlockForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1697
    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "Platform block saved for "

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const-string v0, "PRSocial_TaskFlow"

    invoke-static {v0, p1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1698
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getApplicationContext()Landroid/content/Context;

    move-result-object p1

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    const/4 v2, 0x0

    invoke-static {p1, v0, v1, v2}, Lcom/prsocial/app/AlertSoundManager;->playAlert(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Landroid/widget/LinearLayout;)V

    .line 1700
    sget-object p1, Lcom/prsocial/app/TaskWebViewActivity;->submitResultCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitResultCallback;

    if-eqz p1, :cond_6

    .line 1701
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "\ud83d\udd14 "

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-interface {p1, v0, v3, v1}, Lcom/prsocial/app/TaskWebViewActivity$SubmitResultCallback;->onSubmitResult(Ljava/lang/String;ZLjava/lang/String;)V

    .line 1703
    :cond_6
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/TaskWebViewActivity$11;

    invoke-direct {v1, p0}, Lcom/prsocial/app/TaskWebViewActivity$11;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-static {p1, v0, v1}, Lcom/prsocial/app/ApiClient;->cancelTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void

    nop

    :sswitch_data_0
    .sparse-switch
        -0x36395d8a -> :sswitch_5
        -0x1cbb2c84 -> :sswitch_4
        -0x64d73bd -> :sswitch_3
        0x3ecc2a7c -> :sswitch_2
        0x430d9dbb -> :sswitch_1
        0x5d2a6df8 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_4
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
        :pswitch_4
    .end packed-switch
.end method

.method private triggerTikTokCaptureFlow()V
    .locals 4

    .line 1126
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1127
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->domReadyCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 1129
    const-string v0, "LIKE"

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    const-wide/16 v0, 0x190

    goto :goto_0

    :cond_0
    const-wide/16 v0, 0x4b0

    .line 1130
    :goto_0
    iget-object v2, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v3, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda23;

    invoke-direct {v3, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda23;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {v2, v3, v0, v1}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private updateNavigationButtons()V
    .locals 4

    .line 402
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnBack:Landroid/widget/ImageButton;

    iget-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoBack:Z

    const v2, 0x3eb33333    # 0.35f

    const/high16 v3, 0x3f800000    # 1.0f

    if-nez v1, :cond_1

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {v1}, Ljava/util/ArrayDeque;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_0

    goto :goto_0

    :cond_0
    const v1, 0x3eb33333    # 0.35f

    goto :goto_1

    :cond_1
    :goto_0
    const/high16 v1, 0x3f800000    # 1.0f

    :goto_1
    invoke-virtual {v0, v1}, Landroid/widget/ImageButton;->setAlpha(F)V

    .line 403
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnForward:Landroid/widget/ImageButton;

    iget-boolean v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoForward:Z

    if-eqz v1, :cond_2

    const/high16 v2, 0x3f800000    # 1.0f

    :cond_2
    invoke-virtual {v0, v2}, Landroid/widget/ImageButton;->setAlpha(F)V

    return-void
.end method


# virtual methods
.method synthetic lambda$autoCaptureAndSubmit$37$com-prsocial-app-TaskWebViewActivity(Landroid/graphics/Bitmap;)V
    .locals 0

    .line 0
    if-nez p1, :cond_0

    .line 1407
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->skipTask()V

    return-void

    .line 1408
    :cond_0
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->saveBitmapToFile(Landroid/graphics/Bitmap;)Ljava/io/File;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-nez p1, :cond_1

    .line 1409
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->skipTask()V

    return-void

    :cond_1
    const/4 p1, -0x1

    .line 1411
    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->setResult(I)V

    .line 1412
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->finish()V

    .line 1413
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->doSubmitBackground()V

    return-void
.end method

.method synthetic lambda$autoCaptureAndSubmit$38$com-prsocial-app-TaskWebViewActivity()V
    .locals 1

    .line 1405
    const-string v0, "\ud83d\udcf8 Capture en cours..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1406
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda13;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda13;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->captureVisibleViewport(Lcom/prsocial/app/TaskWebViewActivity$onCapture;)V

    return-void
.end method

.method synthetic lambda$checkDOMReady$27$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1202
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method synthetic lambda$checkDOMReady$28$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1216
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method synthetic lambda$checkDOMReady$29$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1241
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method synthetic lambda$handleAutoResultUri$33$com-prsocial-app-TaskWebViewActivity(Z)V
    .locals 0

    .line 1352
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->handlePageReady(Z)V

    return-void
.end method

.method synthetic lambda$handleAutoResultUri$34$com-prsocial-app-TaskWebViewActivity(ZLjava/lang/String;)V
    .locals 1

    .line 0
    if-eqz p1, :cond_1

    .line 1362
    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "Action "

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    if-nez p2, :cond_0

    const-string p2, ""

    :cond_0
    invoke-virtual {p1, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p2, " confirmee"

    invoke-virtual {p1, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 1363
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    goto :goto_0

    .line 1365
    :cond_1
    const-string p1, "Action non confirmee: pas de soumission auto"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    :goto_0
    return-void
.end method

.method synthetic lambda$handlePageReady$32$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1326
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method synthetic lambda$handleTelegramDomPollResult$30$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1277
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method synthetic lambda$handleTelegramDomPollResult$31$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1285
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method synthetic lambda$handleTikTokFollowResult$18$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 1065
    const-string v0, "page_scan"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 1066
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const-string v1, "(function(){var body=(document.body||document.documentElement);var txt=(body.innerText||body.textContent||\'\').toLowerCase().substring(0,500);alert(\'TGAPP|page_scan_txt|\'+txt);})();"

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$handleTikTokLikeResult$17$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 963
    const-string v0, "page_scan"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 964
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    const-string v1, "(function(){var body=(document.body||document.documentElement);var txt=(body.innerText||body.textContent||\'\').toLowerCase().substring(0,500);alert(\'TGAPP|page_scan_txt|\'+txt);})();"

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$handleTikTokLoginResult$16$com-prsocial-app-TaskWebViewActivity()V
    .locals 1

    .line 904
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->isOpen()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->reload()V

    :cond_0
    return-void
.end method

.method synthetic lambda$handleTikTokPageScanResult$12$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 806
    const-string v0, "verify_follow"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 807
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildVerifyFollowJS()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$handleTikTokPageScanResult$13$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 811
    const-string v0, "verify_like"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 812
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildVerifyLikeJS()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$handleTikTokPageScanResult$14$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 840
    const-string v0, "verify_follow"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 841
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildVerifyFollowJS()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$handleTikTokPageScanResult$15$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 845
    const-string v0, "verify_like"

    iput-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tikTokPendingAction:Ljava/lang/String;

    .line 846
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-static {}, Lcom/prsocial/app/TikTokActionClient;->buildVerifyLikeJS()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/prsocial/app/TikTokActionClient;->runJS(Lorg/mozilla/geckoview/GeckoSession;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$loadPageForScreenshot$11$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 0
    const/4 v0, 0x0

    .line 426
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pageLoadHandled:Z

    .line 427
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoActionResolved:Z

    .line 428
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 429
    const-string v0, "Chargement page..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    .line 430
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->normalizeUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 431
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->urlInput:Lcom/google/android/material/textfield/TextInputEditText;

    invoke-virtual {v1, v0}, Lcom/google/android/material/textfield/TextInputEditText;->setText(Ljava/lang/CharSequence;)V

    .line 433
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->applyWebGLFix()V

    .line 434
    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v1, v0}, Lorg/mozilla/geckoview/GeckoSession;->loadUri(Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$new$0$com-prsocial-app-TaskWebViewActivity(Landroidx/activity/result/ActivityResult;)V
    .locals 4

    .line 50
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    if-eqz v0, :cond_6

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    if-nez v0, :cond_0

    goto/16 :goto_3

    .line 51
    :cond_0
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getResultCode()I

    move-result v0

    const/4 v1, -0x1

    if-ne v0, v1, :cond_5

    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getData()Landroid/content/Intent;

    move-result-object v0

    if-nez v0, :cond_1

    goto :goto_1

    .line 54
    :cond_1
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getData()Landroid/content/Intent;

    move-result-object p1

    .line 55
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 56
    invoke-virtual {p1}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v1

    const/4 v2, 0x0

    if-eqz v1, :cond_2

    const/4 v1, 0x0

    .line 57
    :goto_0
    invoke-virtual {p1}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/ClipData;->getItemCount()I

    move-result v3

    if-ge v1, v3, :cond_3

    .line 58
    invoke-virtual {p1}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object v3

    invoke-virtual {v3, v1}, Landroid/content/ClipData;->getItemAt(I)Landroid/content/ClipData$Item;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/ClipData$Item;->getUri()Landroid/net/Uri;

    move-result-object v3

    invoke-interface {v0, v3}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 59
    :cond_2
    invoke-virtual {p1}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v1

    if-eqz v1, :cond_3

    .line 60
    invoke-virtual {p1}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object p1

    invoke-interface {v0, p1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 62
    :cond_3
    invoke-interface {v0}, Ljava/util/List;->isEmpty()Z

    move-result p1

    if-eqz p1, :cond_4

    .line 63
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;->dismiss()Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$PromptResponse;

    move-result-object v0

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoResult;->complete(Ljava/lang/Object;)V

    goto :goto_2

    .line 65
    :cond_4
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    iget-object v1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    new-array v2, v2, [Landroid/net/Uri;

    invoke-interface {v0, v2}, Ljava/util/List;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Landroid/net/Uri;

    invoke-virtual {v1, p0, v0}, Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;->confirm(Landroid/content/Context;[Landroid/net/Uri;)Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$PromptResponse;

    move-result-object v0

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoResult;->complete(Ljava/lang/Object;)V

    goto :goto_2

    .line 52
    :cond_5
    :goto_1
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;->dismiss()Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$PromptResponse;

    move-result-object v0

    invoke-virtual {p1, v0}, Lorg/mozilla/geckoview/GeckoResult;->complete(Ljava/lang/Object;)V

    :goto_2
    const/4 p1, 0x0

    .line 68
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFilePrompt:Lorg/mozilla/geckoview/GeckoSession$PromptDelegate$FilePrompt;

    .line 69
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->pendingFileResult:Lorg/mozilla/geckoview/GeckoResult;

    :cond_6
    :goto_3
    return-void
.end method

.method synthetic lambda$onCreate$1$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 0

    .line 139
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->finish()V

    return-void
.end method

.method synthetic lambda$onCreate$2$com-prsocial-app-TaskWebViewActivity(Landroid/graphics/Bitmap;)V
    .locals 1

    .line 0
    if-nez p1, :cond_0

    .line 155
    const-string p1, "\u274c Erreur capture"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    return-void

    .line 156
    :cond_0
    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->saveBitmapToFile(Landroid/graphics/Bitmap;)Ljava/io/File;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-eqz p1, :cond_1

    .line 158
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSubmit:Lcom/google/android/material/button/MaterialButton;

    const/4 v0, 0x1

    invoke-virtual {p1, v0}, Lcom/google/android/material/button/MaterialButton;->setEnabled(Z)V

    .line 159
    const-string p1, "\u2714 Capture OK"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    goto :goto_0

    .line 161
    :cond_1
    const-string p1, "\u274c Erreur sauvegarde"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    :goto_0
    return-void
.end method

.method synthetic lambda$onCreate$3$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 0

    .line 154
    new-instance p1, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda4;

    invoke-direct {p1, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda4;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->captureVisibleViewport(Lcom/prsocial/app/TaskWebViewActivity$onCapture;)V

    return-void
.end method

.method synthetic lambda$onCreate$4$com-prsocial-app-TaskWebViewActivity(Landroid/content/DialogInterface;I)V
    .locals 0

    .line 168
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->skipTask()V

    return-void
.end method

.method synthetic lambda$onCreate$5$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 2

    .line 165
    new-instance p1, Landroid/app/AlertDialog$Builder;

    invoke-direct {p1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v0, "Skip ?"

    .line 166
    invoke-virtual {p1, v0}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    const-string v0, "Annuler cette tache et passer a la suivante ?"

    .line 167
    invoke-virtual {p1, v0}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda0;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda0;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    .line 168
    const-string v1, "Skip"

    invoke-virtual {p1, v1, v0}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    const-string v0, "Non"

    const/4 v1, 0x0

    .line 169
    invoke-virtual {p1, v0, v1}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    invoke-virtual {p1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    return-void
.end method

.method synthetic lambda$onCreate$6$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 0

    .line 172
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-nez p1, :cond_0

    const-string p1, "Capturez d\'abord"

    invoke-direct {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->showStatus(Ljava/lang/String;)V

    return-void

    .line 173
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->doSubmit()V

    return-void
.end method

.method synthetic lambda$performActionViaHttp$21$com-prsocial-app-TaskWebViewActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 1

    .line 1138
    const-string v0, "Threads"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/TaskWebViewActivity;->handleActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$performActionViaHttp$22$com-prsocial-app-TaskWebViewActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 1

    .line 1138
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda31;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda31;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$performActionViaHttp$23$com-prsocial-app-TaskWebViewActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 1

    .line 1141
    const-string v0, "YouTube"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/TaskWebViewActivity;->handleActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$performActionViaHttp$24$com-prsocial-app-TaskWebViewActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 1

    .line 1141
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda24;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda24;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$performActionViaHttp$25$com-prsocial-app-TaskWebViewActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 1

    .line 1144
    const-string v0, "Instagram"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/TaskWebViewActivity;->handleActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$performActionViaHttp$26$com-prsocial-app-TaskWebViewActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 1

    .line 1144
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda43;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda43;-><init>(Lcom/prsocial/app/TaskWebViewActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$reportTaskAndFinish$19$com-prsocial-app-TaskWebViewActivity()V
    .locals 1

    .line 1106
    const-string v0, "Rapport en cours..."

    invoke-direct {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->showStatusPersistent(Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$setupToolbar$10$com-prsocial-app-TaskWebViewActivity(Landroid/widget/TextView;ILandroid/view/KeyEvent;)Z
    .locals 3

    .line 0
    const/4 p1, 0x1

    const/4 v0, 0x0

    if-eqz p3, :cond_0

    .line 191
    invoke-virtual {p3}, Landroid/view/KeyEvent;->getKeyCode()I

    move-result v1

    const/16 v2, 0x42

    if-ne v1, v2, :cond_0

    .line 192
    invoke-virtual {p3}, Landroid/view/KeyEvent;->getAction()I

    move-result p3

    if-nez p3, :cond_0

    const/4 p3, 0x1

    goto :goto_0

    :cond_0
    const/4 p3, 0x0

    :goto_0
    const/4 v1, 0x2

    if-eq p2, v1, :cond_2

    const/4 v1, 0x6

    if-eq p2, v1, :cond_2

    if-eqz p3, :cond_1

    goto :goto_1

    :cond_1
    return v0

    .line 194
    :cond_2
    :goto_1
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->loadUrlFromInput()V

    return p1
.end method

.method synthetic lambda$setupToolbar$7$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 0

    .line 184
    iget-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoBack:Z

    if-eqz p1, :cond_0

    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {p1}, Lorg/mozilla/geckoview/GeckoSession;->goBack()V

    goto :goto_0

    .line 185
    :cond_0
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {p1}, Ljava/util/ArrayDeque;->isEmpty()Z

    move-result p1

    if-nez p1, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->closeTopSession()V

    :cond_1
    :goto_0
    return-void
.end method

.method synthetic lambda$setupToolbar$8$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 0

    .line 187
    iget-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoForward:Z

    if-eqz p1, :cond_0

    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {p1}, Lorg/mozilla/geckoview/GeckoSession;->goForward()V

    :cond_0
    return-void
.end method

.method synthetic lambda$setupToolbar$9$com-prsocial-app-TaskWebViewActivity(Landroid/view/View;)V
    .locals 0

    .line 188
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz p1, :cond_0

    invoke-virtual {p1}, Lorg/mozilla/geckoview/GeckoSession;->reload()V

    :cond_0
    return-void
.end method

.method synthetic lambda$showStatus$40$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 1714
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvStatus:Landroid/widget/TextView;

    const/16 v1, 0x8

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setVisibility(I)V

    return-void
.end method

.method synthetic lambda$showStatus$41$com-prsocial-app-TaskWebViewActivity(Ljava/lang/String;)V
    .locals 3

    .line 1712
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvStatus:Landroid/widget/TextView;

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 1713
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvStatus:Landroid/widget/TextView;

    const/4 v0, 0x0

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setVisibility(I)V

    .line 1714
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda2;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda2;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    const-wide/16 v1, 0x9c4

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method synthetic lambda$showStatusPersistent$42$com-prsocial-app-TaskWebViewActivity(Ljava/lang/String;)V
    .locals 1

    .line 1719
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvStatus:Landroid/widget/TextView;

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvStatus:Landroid/widget/TextView;

    const/4 v0, 0x0

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setVisibility(I)V

    return-void
.end method

.method synthetic lambda$startWatchdog$35$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1381
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->skipTask()V

    return-void
.end method

.method synthetic lambda$startWatchdog$36$com-prsocial-app-TaskWebViewActivity()V
    .locals 2

    .line 1377
    const-string v0, "PRSocial_TaskFlow"

    const-string v1, "Watchdog triggered \u2014 skipping task"

    invoke-static {v0, v1}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;)I

    .line 1378
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    if-nez v0, :cond_0

    const/4 v0, 0x1

    .line 1379
    iput-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->terminalActionTriggered:Z

    .line 1380
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTelegramDomPolling()V

    .line 1381
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda21;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda21;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/TaskWebViewActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    :cond_0
    return-void
.end method

.method synthetic lambda$triggerTikTokCaptureFlow$20$com-prsocial-app-TaskWebViewActivity()V
    .locals 0

    .line 1130
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->autoCaptureAndSubmit()V

    return-void
.end method

.method public onBackPressed()V
    .locals 1
    .annotation runtime Ljava/lang/Deprecated;
    .end annotation

    .line 1723
    iget-boolean v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->canGoBack:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->goBack()V

    return-void

    .line 1724
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {v0}, Ljava/util/ArrayDeque;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->closeTopSession()V

    return-void

    .line 1725
    :cond_1
    invoke-super {p0}, Landroidx/appcompat/app/AppCompatActivity;->onBackPressed()V

    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 2

    .line 116
    invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V

    .line 117
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getWindow()Landroid/view/Window;

    move-result-object p1

    const/4 v0, 0x1

    invoke-static {p1, v0}, Landroidx/core/view/WindowCompat;->setDecorFitsSystemWindows(Landroid/view/Window;Z)V

    .line 118
    sget p1, Lcom/prsocial/app/R$layout;->activity_task_webview:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->setContentView(I)V

    .line 120
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "token"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->token:Ljava/lang/String;

    .line 121
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "taskId"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskId:Ljava/lang/String;

    .line 122
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "url"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    .line 123
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "actionType"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    .line 124
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "taskAutoMode"

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    move-result p1

    iput-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->autoMode:Z

    .line 125
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "httpActionDone"

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z

    move-result p1

    iput-boolean p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->httpActionAlreadyDone:Z

    .line 126
    invoke-virtual {p0}, Lcom/prsocial/app/TaskWebViewActivity;->getIntent()Landroid/content/Intent;

    move-result-object p1

    const-string v0, "platform"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    if-nez p1, :cond_0

    .line 127
    const-string p1, "instagram"

    .line 128
    :cond_0
    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->currentPlatform:Ljava/lang/String;

    .line 129
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    if-eqz p1, :cond_1

    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    move-result p1

    if-eqz p1, :cond_2

    :cond_1
    const-string p1, "https://www.instagram.com/"

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->taskUrl:Ljava/lang/String;

    .line 131
    :cond_2
    sget p1, Lcom/prsocial/app/R$id;->task_webview:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Lorg/mozilla/geckoview/GeckoView;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->geckoView:Lorg/mozilla/geckoview/GeckoView;

    .line 132
    sget p1, Lcom/prsocial/app/R$id;->task_url_input:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Lcom/google/android/material/textfield/TextInputEditText;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->urlInput:Lcom/google/android/material/textfield/TextInputEditText;

    .line 133
    sget p1, Lcom/prsocial/app/R$id;->task_progress_bar:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/ProgressBar;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->progressBar:Landroid/widget/ProgressBar;

    .line 134
    sget p1, Lcom/prsocial/app/R$id;->btn_task_back:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/ImageButton;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnBack:Landroid/widget/ImageButton;

    .line 135
    sget p1, Lcom/prsocial/app/R$id;->btn_task_forward:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/ImageButton;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnForward:Landroid/widget/ImageButton;

    .line 136
    sget p1, Lcom/prsocial/app/R$id;->btn_task_refresh:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/ImageButton;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnRefresh:Landroid/widget/ImageButton;

    .line 138
    sget p1, Lcom/prsocial/app/R$id;->btn_close_task:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/ImageButton;

    .line 139
    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda44;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda44;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Landroid/widget/ImageButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 141
    sget p1, Lcom/prsocial/app/R$id;->btn_capture:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Lcom/google/android/material/button/MaterialButton;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnCapture:Lcom/google/android/material/button/MaterialButton;

    .line 142
    sget p1, Lcom/prsocial/app/R$id;->btn_skip:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Lcom/google/android/material/button/MaterialButton;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSkip:Lcom/google/android/material/button/MaterialButton;

    .line 143
    sget p1, Lcom/prsocial/app/R$id;->btn_submit_screenshot:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Lcom/google/android/material/button/MaterialButton;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSubmit:Lcom/google/android/material/button/MaterialButton;

    .line 144
    sget p1, Lcom/prsocial/app/R$id;->tv_status:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvStatus:Landroid/widget/TextView;

    .line 145
    sget p1, Lcom/prsocial/app/R$id;->tv_action_type:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/TaskWebViewActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    iput-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvActionType:Landroid/widget/TextView;

    .line 147
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    if-eqz p1, :cond_3

    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    move-result p1

    if-nez p1, :cond_3

    .line 148
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvActionType:Landroid/widget/TextView;

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->actionType:Ljava/lang/String;

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 149
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvActionType:Landroid/widget/TextView;

    invoke-virtual {p1, v1}, Landroid/widget/TextView;->setVisibility(I)V

    goto :goto_0

    .line 151
    :cond_3
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->tvActionType:Landroid/widget/TextView;

    const/16 v0, 0x8

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setVisibility(I)V

    .line 154
    :goto_0
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnCapture:Lcom/google/android/material/button/MaterialButton;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda45;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda45;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lcom/google/android/material/button/MaterialButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 165
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSkip:Lcom/google/android/material/button/MaterialButton;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda46;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda46;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lcom/google/android/material/button/MaterialButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 171
    iget-object p1, p0, Lcom/prsocial/app/TaskWebViewActivity;->btnSubmit:Lcom/google/android/material/button/MaterialButton;

    new-instance v0, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda1;

    invoke-direct {v0, p0}, Lcom/prsocial/app/TaskWebViewActivity$$ExternalSyntheticLambda1;-><init>(Lcom/prsocial/app/TaskWebViewActivity;)V

    invoke-virtual {p1, v0}, Lcom/google/android/material/button/MaterialButton;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 176
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->setupToolbar()V

    .line 177
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->setupGecko()V

    .line 178
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->loadPageForScreenshot()V

    .line 179
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->startWatchdog()V

    return-void
.end method

.method protected onDestroy()V
    .locals 2

    .line 1729
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokDomPolling()V

    .line 1730
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTikTokPageScanLoop()V

    .line 1731
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelTelegramDomPolling()V

    .line 1732
    invoke-direct {p0}, Lcom/prsocial/app/TaskWebViewActivity;->cancelWatchdog()V

    .line 1733
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->handler:Landroid/os/Handler;

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacksAndMessages(Ljava/lang/Object;)V

    .line 1734
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->isOpen()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->activeSession:Lorg/mozilla/geckoview/GeckoSession;

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->close()V

    .line 1735
    :cond_0
    :goto_0
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {v0}, Ljava/util/ArrayDeque;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_1

    .line 1736
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->sessionStack:Ljava/util/ArrayDeque;

    invoke-virtual {v0}, Ljava/util/ArrayDeque;->removeLast()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lorg/mozilla/geckoview/GeckoSession;

    .line 1737
    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->isOpen()Z

    move-result v1

    if-eqz v1, :cond_0

    invoke-virtual {v0}, Lorg/mozilla/geckoview/GeckoSession;->close()V

    goto :goto_0

    .line 1739
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    if-eqz v0, :cond_2

    invoke-virtual {v0}, Ljava/io/File;->exists()Z

    move-result v0

    if-eqz v0, :cond_2

    iget-object v0, p0, Lcom/prsocial/app/TaskWebViewActivity;->selectedImage:Ljava/io/File;

    invoke-virtual {v0}, Ljava/io/File;->delete()Z

    .line 1740
    :cond_2
    invoke-super {p0}, Landroidx/appcompat/app/AppCompatActivity;->onDestroy()V

    return-void
.end method
