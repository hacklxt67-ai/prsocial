.class public Lcom/prsocial/app/MainActivity;
.super Landroidx/appcompat/app/AppCompatActivity;
.source "MainActivity.java"


# static fields
.field private static final MULTI_PLATFORMS:[Ljava/lang/String;

.field private static final MULTI_PLATFORM_EMOJIS:[Ljava/lang/String;

.field private static final MULTI_PLATFORM_NAMES:[Ljava/lang/String;

.field private static final SUB_CHECK_INTERVAL:J = 0xdbba0L

.field private static final TAG:Ljava/lang/String; = "PRSocial_Main"

.field private static final TASK_RESULT_CODE:I = 0x1389


# instance fields
.field private final blacklistedTaskIds:Ljava/util/Set;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Set<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private btnInstagram:Landroid/widget/Button;

.field private btnLoadTasks:Landroid/widget/Button;

.field private btnLoadTelegram:Landroid/widget/Button;

.field private btnLoadThreads:Landroid/widget/Button;

.field private btnLoadTikTok:Landroid/widget/Button;

.field private btnLoadYouTube:Landroid/widget/Button;

.field private btnMultiLaunch:Landroid/widget/Button;

.field private btnTelegramAccount:Landroid/widget/Button;

.field private btnThreads:Landroid/widget/Button;

.field private btnTikTok:Landroid/widget/Button;

.field private btnToggleEmail:Landroid/widget/TextView;

.field private btnYouTube:Landroid/widget/Button;

.field private containerTelegram:Landroid/widget/LinearLayout;

.field private containerThreads:Landroid/widget/LinearLayout;

.field private containerTikTok:Landroid/widget/LinearLayout;

.field private containerYouTube:Landroid/widget/LinearLayout;

.field private currentMultiPlatform:Ljava/lang/String;

.field private currentTaskIndex:I

.field private emailVisible:Z

.field private fullEmail:Ljava/lang/String;

.field private isManualMode:Z

.field private isMultiRunning:Z

.field private isRunning:Z

.field private final logTimeFmt:Ljava/text/SimpleDateFormat;

.field private manualPlatform:Ljava/lang/String;

.field private final multiEnabled:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/Boolean;",
            ">;"
        }
    .end annotation
.end field

.field private multiLogContainer:Landroid/widget/LinearLayout;

.field private multiLogHeader:Landroid/widget/LinearLayout;

.field private multiLogScroll:Landroidx/core/widget/NestedScrollView;

.field private multiOverlay:Landroid/widget/LinearLayout;

.field private multiQueue:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field private multiQueueIndex:I

.field private final multiTaskIndexes:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/Integer;",
            ">;"
        }
    .end annotation
.end field

.field private final multiTaskLists:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/util/List<",
            "Lorg/json/JSONObject;",
            ">;>;"
        }
    .end annotation
.end field

.field private final multiToggleBtns:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Landroid/widget/Button;",
            ">;"
        }
    .end annotation
.end field

.field private networkBanner:Landroid/view/View;

.field private networkMonitor:Lcom/prsocial/app/NetworkMonitor;

.field private final platformLinked:Ljava/util/Map;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/Map<",
            "Ljava/lang/String;",
            "Ljava/lang/Boolean;",
            ">;"
        }
    .end annotation
.end field

.field private progressTelegram:Landroid/widget/ProgressBar;

.field private progressThreads:Landroid/widget/ProgressBar;

.field private progressTikTok:Landroid/widget/ProgressBar;

.field private progressYouTube:Landroid/widget/ProgressBar;

.field private sm:Lcom/prsocial/app/SessionManager;

.field private statusRow:Landroid/widget/LinearLayout;

.field private statusRowContainer:Landroid/widget/LinearLayout;

.field private final subCheckHandler:Landroid/os/Handler;

.field private final subCheckRunnable:Ljava/lang/Runnable;

.field private subCountdown:Landroid/os/CountDownTimer;

.field private subMgr:Lcom/prsocial/app/SubscriptionManager;

.field private swipeRefresh:Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

.field private taskLauncher:Landroidx/activity/result/ActivityResultLauncher;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Landroidx/activity/result/ActivityResultLauncher<",
            "Landroid/content/Intent;",
            ">;"
        }
    .end annotation
.end field

.field private taskList:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Lorg/json/JSONObject;",
            ">;"
        }
    .end annotation
.end field

.field private taskListContainer:Landroid/widget/LinearLayout;

.field private taskLogContainer:Landroid/widget/LinearLayout;

.field private taskLogContainerTelegram:Landroid/widget/LinearLayout;

.field private taskLogContainerThreads:Landroid/widget/LinearLayout;

.field private taskLogContainerTikTok:Landroid/widget/LinearLayout;

.field private taskLogContainerYouTube:Landroid/widget/LinearLayout;

.field private taskLogHeader:Landroid/widget/LinearLayout;

.field private taskLogHeaderTelegram:Landroid/widget/LinearLayout;

.field private taskLogHeaderThreads:Landroid/widget/LinearLayout;

.field private taskLogHeaderTikTok:Landroid/widget/LinearLayout;

.field private taskLogHeaderYouTube:Landroid/widget/LinearLayout;

.field private taskLogScroll:Landroidx/core/widget/NestedScrollView;

.field private taskLogScrollTelegram:Landroidx/core/widget/NestedScrollView;

.field private taskLogScrollThreads:Landroidx/core/widget/NestedScrollView;

.field private taskLogScrollTikTok:Landroidx/core/widget/NestedScrollView;

.field private taskLogScrollYouTube:Landroidx/core/widget/NestedScrollView;

.field private taskProgress:Landroid/widget/ProgressBar;

.field private telegramNextScheduled:Z

.field private tgSm:Lcom/prsocial/app/TelegramSessionManager;

.field private token:Ljava/lang/String;

.field private tvAbandoned:Landroid/widget/TextView;

.field private tvApproved:Landroid/widget/TextView;

.field private tvBalance:Landroid/widget/TextView;

.field private tvEarned:Landroid/widget/TextView;

.field private tvInstaStatus:Landroid/widget/TextView;

.field private tvMonthEarned:Landroid/widget/TextView;

.field private tvMonthTasks:Landroid/widget/TextView;

.field private tvPending:Landroid/widget/TextView;

.field private tvProfileEmail:Landroid/widget/TextView;

.field private tvProfileId:Landroid/widget/TextView;

.field private tvProfileStatus:Landroid/widget/TextView;

.field private tvProfileUsername:Landroid/widget/TextView;

.field private tvStreak:Landroid/widget/TextView;

.field private tvTaskStatus:Landroid/widget/TextView;

.field private tvTelegramStatus:Landroid/widget/TextView;

.field private tvThreadsStatus:Landroid/widget/TextView;

.field private tvTikTokStatus:Landroid/widget/TextView;

.field private tvTodayEarned:Landroid/widget/TextView;

.field private tvTodayTasks:Landroid/widget/TextView;

.field private tvWeekEarned:Landroid/widget/TextView;

.field private tvWeekTasks:Landroid/widget/TextView;

.field private tvYouTubeStatus:Landroid/widget/TextView;


# direct methods
.method public static synthetic $r8$lambda$M6h-FmtrOqgBZpnb6Wt081Ih8bs(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runSubscriptionCheck()V

    return-void
.end method

.method static constructor <clinit>()V
    .locals 5

    .line 123
    const-string v0, "youtube"

    const-string v1, "telegram"

    const-string v2, "instagram"

    const-string v3, "tiktok"

    const-string v4, "threads"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORMS:[Ljava/lang/String;

    .line 124
    const-string v0, "\u25b6"

    const-string v1, "\u2708"

    const-string v2, "\ud83d\udcf7"

    const-string v3, "\ud83c\udfb5"

    const-string v4, "\ud83e\uddf5"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORM_EMOJIS:[Ljava/lang/String;

    .line 125
    const-string v0, "YouTube"

    const-string v1, "Telegram"

    const-string v2, "Instagram"

    const-string v3, "TikTok"

    const-string v4, "Threads"

    filled-new-array {v2, v3, v4, v0, v1}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORM_NAMES:[Ljava/lang/String;

    return-void
.end method

.method public constructor <init>()V
    .locals 5

    .line 23
    invoke-direct {p0}, Landroidx/appcompat/app/AppCompatActivity;-><init>()V

    .line 35
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->subCheckHandler:Landroid/os/Handler;

    .line 36
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda20;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda20;-><init>(Lcom/prsocial/app/MainActivity;)V

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->subCheckRunnable:Ljava/lang/Runnable;

    .line 49
    const-string v0, ""

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->fullEmail:Ljava/lang/String;

    const/4 v1, 0x0

    .line 50
    iput-boolean v1, p0, Lcom/prsocial/app/MainActivity;->emailVisible:Z

    .line 71
    new-instance v2, Ljava/util/HashMap;

    invoke-direct {v2}, Ljava/util/HashMap;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->platformLinked:Ljava/util/Map;

    .line 80
    new-instance v2, Ljava/util/ArrayList;

    invoke-direct {v2}, Ljava/util/ArrayList;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    .line 81
    iput v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    .line 83
    new-instance v2, Ljava/util/HashSet;

    invoke-direct {v2}, Ljava/util/HashSet;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->blacklistedTaskIds:Ljava/util/Set;

    .line 85
    iput-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    .line 86
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    .line 89
    iput-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    .line 101
    new-instance v2, Ljava/text/SimpleDateFormat;

    const-string v3, "HH:mm:ss"

    invoke-static {}, Ljava/util/Locale;->getDefault()Ljava/util/Locale;

    move-result-object v4

    invoke-direct {v2, v3, v4}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;Ljava/util/Locale;)V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->logTimeFmt:Ljava/text/SimpleDateFormat;

    .line 108
    new-instance v2, Ljava/util/HashMap;

    invoke-direct {v2}, Ljava/util/HashMap;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->multiEnabled:Ljava/util/Map;

    .line 110
    new-instance v2, Ljava/util/ArrayList;

    invoke-direct {v2}, Ljava/util/ArrayList;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    .line 111
    iput v1, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    .line 112
    iput-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    .line 120
    new-instance v2, Ljava/util/HashMap;

    invoke-direct {v2}, Ljava/util/HashMap;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    .line 121
    new-instance v2, Ljava/util/HashMap;

    invoke-direct {v2}, Ljava/util/HashMap;-><init>()V

    iput-object v2, p0, Lcom/prsocial/app/MainActivity;->multiTaskIndexes:Ljava/util/Map;

    .line 122
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    .line 126
    new-instance v0, Ljava/util/HashMap;

    invoke-direct {v0}, Ljava/util/HashMap;-><init>()V

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->multiToggleBtns:Ljava/util/Map;

    .line 1996
    iput-boolean v1, p0, Lcom/prsocial/app/MainActivity;->telegramNextScheduled:Z

    return-void
.end method

.method static synthetic access$000(Lcom/prsocial/app/MainActivity;)Landroid/view/View;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->networkBanner:Landroid/view/View;

    return-object p0
.end method

.method static synthetic access$100(Lcom/prsocial/app/MainActivity;Ljava/lang/String;I)V
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2}, Lcom/prsocial/app/MainActivity;->appendActiveLog(Ljava/lang/String;I)V

    return-void
.end method

.method static synthetic access$1000(Lcom/prsocial/app/MainActivity;)Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->swipeRefresh:Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

    return-object p0
.end method

.method static synthetic access$1100(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->logout()V

    return-void
.end method

.method static synthetic access$1200(Lcom/prsocial/app/MainActivity;Lorg/json/JSONObject;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->updateDashboardUI(Lorg/json/JSONObject;)V

    return-void
.end method

.method static synthetic access$1300(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvInstaStatus:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$1400(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvTikTokStatus:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$1500(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvThreadsStatus:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$1600(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvYouTubeStatus:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$1700(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    return-void
.end method

.method static synthetic access$1800(Lcom/prsocial/app/MainActivity;Landroid/widget/TextView;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2}, Lcom/prsocial/app/MainActivity;->resetSocialStatus(Landroid/widget/TextView;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$1900(Lcom/prsocial/app/MainActivity;)Ljava/util/Map;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->platformLinked:Ljava/util/Map;

    return-object p0
.end method

.method static synthetic access$200(Lcom/prsocial/app/MainActivity;)Z
    .locals 0

    .line 23
    iget-boolean p0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    return p0
.end method

.method static synthetic access$2000(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyPlatformButtonStates()V

    return-void
.end method

.method static synthetic access$2100(Lcom/prsocial/app/MainActivity;Landroid/widget/TextView;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2, p3}, Lcom/prsocial/app/MainActivity;->updateSocialStatus(Landroid/widget/TextView;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$2200(Lcom/prsocial/app/MainActivity;)Lcom/prsocial/app/SessionManager;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    return-object p0
.end method

.method static synthetic access$2300(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->onAutomationStopped(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$2400(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    return-void
.end method

.method static synthetic access$2500(Lcom/prsocial/app/MainActivity;)Ljava/util/List;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    return-object p0
.end method

.method static synthetic access$2602(Lcom/prsocial/app/MainActivity;I)I
    .locals 0

    .line 23
    iput p1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    return p1
.end method

.method static synthetic access$2700(Lcom/prsocial/app/MainActivity;)Ljava/util/Set;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->blacklistedTaskIds:Ljava/util/Set;

    return-object p0
.end method

.method static synthetic access$2800(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    .line 23
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->extractActionType(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static synthetic access$2900(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;)Z
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2}, Lcom/prsocial/app/MainActivity;->isSkippableAction(Ljava/lang/String;Ljava/lang/String;)Z

    move-result p0

    return p0
.end method

.method static synthetic access$300(Lcom/prsocial/app/MainActivity;)Ljava/lang/String;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$3000(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTask()V

    return-void
.end method

.method static synthetic access$3100(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeCurrentManualTaskAndLoadNext()V

    return-void
.end method

.method static synthetic access$3200(Lcom/prsocial/app/MainActivity;)Ljava/lang/String;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    return-object p0
.end method

.method static synthetic access$3300(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct/range {p0 .. p5}, Lcom/prsocial/app/MainActivity;->appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    return-void
.end method

.method static synthetic access$3400(Lcom/prsocial/app/MainActivity;)Z
    .locals 0

    .line 23
    iget-boolean p0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    return p0
.end method

.method static synthetic access$3500(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->onMultiPlatformDone(Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$3600(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)I
    .locals 0

    .line 23
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->parseWaitSeconds(Ljava/lang/String;)I

    move-result p0

    return p0
.end method

.method static synthetic access$3700(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct/range {p0 .. p6}, Lcom/prsocial/app/MainActivity;->openManualTaskWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$3800(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTaskInner()V

    return-void
.end method

.method static synthetic access$3900(Lcom/prsocial/app/MainActivity;)Landroid/widget/ProgressBar;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->taskProgress:Landroid/widget/ProgressBar;

    return-object p0
.end method

.method static synthetic access$400(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->resumeAutomation()V

    return-void
.end method

.method static synthetic access$4000(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTask()V

    return-void
.end method

.method static synthetic access$4100(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeCurrentTaskAndLoadNext()V

    return-void
.end method

.method static synthetic access$4200(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct/range {p0 .. p5}, Lcom/prsocial/app/MainActivity;->openTaskWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$4300(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTaskInner()V

    return-void
.end method

.method static synthetic access$4400(Lcom/prsocial/app/MainActivity;)Z
    .locals 0

    .line 23
    iget-boolean p0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    return p0
.end method

.method static synthetic access$4500(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2, p3, p4}, Lcom/prsocial/app/MainActivity;->appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    return-void
.end method

.method static synthetic access$4600(Lcom/prsocial/app/MainActivity;Ljava/lang/String;I)V
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    return-void
.end method

.method static synthetic access$4700(Lcom/prsocial/app/MainActivity;)Landroid/widget/ProgressBar;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->progressTelegram:Landroid/widget/ProgressBar;

    return-object p0
.end method

.method static synthetic access$4800(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTelegramTask()V

    return-void
.end method

.method static synthetic access$4900(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeTelegramTaskAndNext()V

    return-void
.end method

.method static synthetic access$5000(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 23
    invoke-direct {p0, p1, p2, p3}, Lcom/prsocial/app/MainActivity;->executeTelegramJoin(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method static synthetic access$502(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    .line 23
    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->fullEmail:Ljava/lang/String;

    return-object p1
.end method

.method static synthetic access$5100(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runSubscriptionCheck()V

    return-void
.end method

.method static synthetic access$5200(Lcom/prsocial/app/MainActivity;)Ljava/util/Map;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    return-object p0
.end method

.method static synthetic access$5300(Lcom/prsocial/app/MainActivity;)Ljava/util/Map;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->multiTaskIndexes:Ljava/util/Map;

    return-object p0
.end method

.method static synthetic access$5400(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runNextMultiPlatform()V

    return-void
.end method

.method static synthetic access$600(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvProfileUsername:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$700(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvProfileId:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$800(Lcom/prsocial/app/MainActivity;)Landroid/widget/TextView;
    .locals 0

    .line 23
    iget-object p0, p0, Lcom/prsocial/app/MainActivity;->tvProfileStatus:Landroid/widget/TextView;

    return-object p0
.end method

.method static synthetic access$900(Lcom/prsocial/app/MainActivity;)V
    .locals 0

    .line 23
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->updateEmailDisplay()V

    return-void
.end method

.method private animateCountUp(Landroid/widget/TextView;DLjava/lang/String;)V
    .locals 12

    .line 595
    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    .line 596
    new-instance v10, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v0

    invoke-direct {v10, v0}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v11, Lcom/prsocial/app/MainActivity$4;

    const-wide/16 v4, 0x3e8

    move-object v0, v11

    move-object v1, p0

    move-wide v6, p2

    move-object v8, p1

    move-object/from16 v9, p4

    invoke-direct/range {v0 .. v9}, Lcom/prsocial/app/MainActivity$4;-><init>(Lcom/prsocial/app/MainActivity;JJDLandroid/widget/TextView;Ljava/lang/String;)V

    invoke-virtual {v10, v11}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    return-void
.end method

.method private appendActiveLog(Ljava/lang/String;I)V
    .locals 7

    .line 2475
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    goto :goto_0

    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogContainer()Landroid/widget/LinearLayout;

    move-result-object v0

    .line 2476
    :goto_0
    iget-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v1, :cond_1

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    goto :goto_1

    :cond_1
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogScroll()Landroidx/core/widget/NestedScrollView;

    move-result-object v1

    .line 2477
    :goto_1
    iget-boolean v2, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v2, :cond_2

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->multiLogHeader:Landroid/widget/LinearLayout;

    goto :goto_2

    :cond_2
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogHeader()Landroid/widget/LinearLayout;

    move-result-object v2

    :goto_2
    if-nez v0, :cond_3

    return-void

    :cond_3
    const/4 v3, 0x0

    if-eqz v2, :cond_4

    .line 2479
    invoke-virtual {v2, v3}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_4
    if-eqz v1, :cond_5

    .line 2480
    invoke-virtual {v1, v3}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 2481
    :cond_5
    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->logTimeFmt:Ljava/text/SimpleDateFormat;

    new-instance v4, Ljava/util/Date;

    invoke-direct {v4}, Ljava/util/Date;-><init>()V

    invoke-virtual {v2, v4}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v2

    .line 2482
    new-instance v4, Landroid/widget/TextView;

    invoke-direct {v4, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 2483
    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "["

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, "] "

    invoke-virtual {v5, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v5, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v4, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 2484
    invoke-virtual {v4, p2}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p1, 0x41300000    # 11.0f

    .line 2485
    invoke-virtual {v4, p1}, Landroid/widget/TextView;->setTextSize(F)V

    .line 2486
    sget-object p1, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v4, p1}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    const/4 p1, 0x2

    .line 2487
    invoke-virtual {v4, v3, p1, v3, p1}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 2488
    invoke-virtual {v0, v4}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    if-eqz v1, :cond_6

    .line 2489
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda18;

    invoke-direct {p1, v1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda18;-><init>(Landroidx/core/widget/NestedScrollView;)V

    invoke-virtual {v1, p1}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    :cond_6
    return-void
.end method

.method private appendCountdownThenNext(Ljava/lang/String;I)V
    .locals 4

    .line 2556
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz p1, :cond_0

    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    goto :goto_0

    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogContainer()Landroid/widget/LinearLayout;

    move-result-object p1

    .line 2557
    :goto_0
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    goto :goto_1

    :cond_1
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogScroll()Landroidx/core/widget/NestedScrollView;

    move-result-object v0

    :goto_1
    if-nez p1, :cond_2

    return-void

    .line 2560
    :cond_2
    new-instance v1, Landroid/widget/TextView;

    invoke-direct {v1, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    const/16 v2, -0x2900

    .line 2561
    invoke-virtual {v1, v2}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 v2, 0x41300000    # 11.0f

    .line 2562
    invoke-virtual {v1, v2}, Landroid/widget/TextView;->setTextSize(F)V

    .line 2563
    sget-object v2, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v1, v2}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    const/4 v2, 0x0

    const/4 v3, 0x2

    .line 2564
    invoke-virtual {v1, v2, v3, v2, v3}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 2565
    invoke-virtual {p1, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    if-eqz v0, :cond_3

    .line 2566
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda11;

    invoke-direct {p1, v0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda11;-><init>(Landroidx/core/widget/NestedScrollView;)V

    invoke-virtual {v0, p1}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    .line 2568
    :cond_3
    new-instance p1, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v0

    invoke-direct {p1, v0}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    .line 2569
    filled-new-array {p2}, [I

    move-result-object p2

    const/4 v0, 0x1

    .line 2570
    new-array v0, v0, [Ljava/lang/Runnable;

    const/4 v3, 0x0

    aput-object v3, v0, v2

    .line 2571
    new-instance v3, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda22;

    invoke-direct {v3, p2, v1, p1, v0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda22;-><init>([ILandroid/widget/TextView;Landroid/os/Handler;[Ljava/lang/Runnable;)V

    aput-object v3, v0, v2

    .line 2589
    aget-object p2, v0, v2

    invoke-virtual {p1, p2}, Landroid/os/Handler;->post(Ljava/lang/Runnable;)Z

    return-void
.end method

.method private appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V
    .locals 7

    .line 1629
    new-instance v6, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda62;

    move-object v0, v6

    move-object v1, p0

    move-object v2, p2

    move v3, p3

    move-object v4, p1

    move-object v5, p4

    invoke-direct/range {v0 .. v5}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda62;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;ZLjava/lang/String;Ljava/lang/String;)V

    invoke-virtual {p0, v6}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V
    .locals 9

    .line 2520
    iget-boolean p3, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz p3, :cond_0

    .line 2521
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    .line 2522
    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    .line 2523
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogHeader:Landroid/widget/LinearLayout;

    :goto_0
    move-object v8, p1

    move-object v4, p3

    move-object v3, v0

    goto :goto_2

    .line 2525
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result p3

    const/4 v0, -0x1

    sparse-switch p3, :sswitch_data_0

    goto :goto_1

    :sswitch_0
    const-string p3, "tiktok"

    invoke-virtual {p1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_1

    :cond_1
    const/4 v0, 0x3

    goto :goto_1

    :sswitch_1
    const-string p3, "youtube"

    invoke-virtual {p1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_1

    :cond_2
    const/4 v0, 0x2

    goto :goto_1

    :sswitch_2
    const-string p3, "threads"

    invoke-virtual {p1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_1

    :cond_3
    const/4 v0, 0x1

    goto :goto_1

    :sswitch_3
    const-string p3, "telegram"

    invoke-virtual {p1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_4

    goto :goto_1

    :cond_4
    const/4 v0, 0x0

    :goto_1
    packed-switch v0, :pswitch_data_0

    .line 2530
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainer:Landroid/widget/LinearLayout;

    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->taskLogScroll:Landroidx/core/widget/NestedScrollView;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeader:Landroid/widget/LinearLayout;

    goto :goto_0

    .line 2526
    :pswitch_0
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTikTok:Landroid/widget/LinearLayout;

    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTikTok:Landroidx/core/widget/NestedScrollView;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderTikTok:Landroid/widget/LinearLayout;

    goto :goto_0

    .line 2528
    :pswitch_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerYouTube:Landroid/widget/LinearLayout;

    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollYouTube:Landroidx/core/widget/NestedScrollView;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderYouTube:Landroid/widget/LinearLayout;

    goto :goto_0

    .line 2527
    :pswitch_2
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerThreads:Landroid/widget/LinearLayout;

    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollThreads:Landroidx/core/widget/NestedScrollView;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderThreads:Landroid/widget/LinearLayout;

    goto :goto_0

    .line 2529
    :pswitch_3
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTelegram:Landroid/widget/LinearLayout;

    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTelegram:Landroidx/core/widget/NestedScrollView;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderTelegram:Landroid/widget/LinearLayout;

    goto :goto_0

    :goto_2
    if-nez v8, :cond_5

    return-void

    .line 2537
    :cond_5
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda31;

    move-object v1, p1

    move-object v2, p0

    move v5, p4

    move-object v6, p2

    move-object v7, p5

    invoke-direct/range {v1 .. v8}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda31;-><init>(Lcom/prsocial/app/MainActivity;Landroid/widget/LinearLayout;Landroidx/core/widget/NestedScrollView;ZLjava/lang/String;Ljava/lang/String;Landroid/widget/LinearLayout;)V

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private appendMultiLog(Ljava/lang/String;I)V
    .locals 1

    .line 2493
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda65;

    invoke-direct {v0, p0, p1, p2}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda65;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;I)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private appendSpinnerRow(Ljava/lang/String;I)V
    .locals 24

    move-object/from16 v0, p0

    .line 1531
    iget-boolean v1, v0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v1, :cond_0

    iget-object v1, v0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    goto :goto_0

    :cond_0
    invoke-direct/range {p0 .. p0}, Lcom/prsocial/app/MainActivity;->getActiveLogContainer()Landroid/widget/LinearLayout;

    move-result-object v1

    .line 1532
    :goto_0
    iget-boolean v2, v0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v2, :cond_1

    iget-object v2, v0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    goto :goto_1

    :cond_1
    invoke-direct/range {p0 .. p0}, Lcom/prsocial/app/MainActivity;->getActiveLogScroll()Landroidx/core/widget/NestedScrollView;

    move-result-object v2

    .line 1533
    :goto_1
    iget-boolean v3, v0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v3, :cond_2

    iget-object v3, v0, Lcom/prsocial/app/MainActivity;->multiLogHeader:Landroid/widget/LinearLayout;

    goto :goto_2

    :cond_2
    invoke-direct/range {p0 .. p0}, Lcom/prsocial/app/MainActivity;->getActiveLogHeader()Landroid/widget/LinearLayout;

    move-result-object v3

    :goto_2
    if-nez v1, :cond_3

    return-void

    :cond_3
    const/4 v4, 0x0

    if-eqz v3, :cond_4

    .line 1535
    invoke-virtual {v3, v4}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_4
    if-eqz v2, :cond_5

    .line 1536
    invoke-virtual {v2, v4}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 1538
    :cond_5
    iget-object v3, v0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    const/4 v5, 0x0

    if-eqz v3, :cond_7

    .line 1539
    invoke-virtual {v3}, Landroid/widget/LinearLayout;->getParent()Landroid/view/ViewParent;

    move-result-object v3

    if-eqz v3, :cond_6

    .line 1540
    iget-object v3, v0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v3}, Landroid/widget/LinearLayout;->getParent()Landroid/view/ViewParent;

    move-result-object v3

    check-cast v3, Landroid/view/ViewGroup;

    iget-object v6, v0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v3, v6}, Landroid/view/ViewGroup;->removeView(Landroid/view/View;)V

    .line 1541
    :cond_6
    iput-object v5, v0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    .line 1542
    iput-object v5, v0, Lcom/prsocial/app/MainActivity;->statusRowContainer:Landroid/widget/LinearLayout;

    .line 1544
    :cond_7
    const-string v15, "\u2807"

    const-string v16, "\u280f"

    const-string v7, "\u280b"

    const-string v8, "\u2819"

    const-string v9, "\u2839"

    const-string v10, "\u2838"

    const-string v11, "\u283c"

    const-string v12, "\u2834"

    const-string v13, "\u2826"

    const-string v14, "\u2827"

    filled-new-array/range {v7 .. v16}, [Ljava/lang/String;

    move-result-object v20

    .line 1545
    filled-new-array {v4}, [I

    move-result-object v19

    .line 1546
    new-instance v3, Landroid/widget/TextView;

    invoke-direct {v3, v0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 1547
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    aget-object v7, v20, v4

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v7, " "

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-object/from16 v7, p1

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v3, v6}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    move/from16 v6, p2

    .line 1548
    invoke-virtual {v3, v6}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 v6, 0x41300000    # 11.0f

    .line 1549
    invoke-virtual {v3, v6}, Landroid/widget/TextView;->setTextSize(F)V

    .line 1550
    sget-object v6, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v3, v6}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    const/4 v6, 0x2

    .line 1551
    invoke-virtual {v3, v4, v6, v4, v6}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 1552
    new-instance v6, Landroid/widget/LinearLayout;

    invoke-direct {v6, v0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    const/4 v8, 0x1

    .line 1553
    invoke-virtual {v6, v8}, Landroid/widget/LinearLayout;->setOrientation(I)V

    .line 1554
    invoke-virtual {v6, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1555
    invoke-virtual {v1, v6}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1556
    iput-object v6, v0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    .line 1557
    iput-object v1, v0, Lcom/prsocial/app/MainActivity;->statusRowContainer:Landroid/widget/LinearLayout;

    if-eqz v2, :cond_8

    .line 1558
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda13;

    invoke-direct {v1, v2}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda13;-><init>(Landroidx/core/widget/NestedScrollView;)V

    invoke-virtual {v2, v1}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    .line 1559
    :cond_8
    new-instance v1, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v2

    invoke-direct {v1, v2}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    .line 1560
    new-array v2, v8, [Ljava/lang/Runnable;

    aput-object v5, v2, v4

    .line 1561
    new-instance v5, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda14;

    move-object/from16 v17, v5

    move-object/from16 v18, v3

    move-object/from16 v21, p1

    move-object/from16 v22, v1

    move-object/from16 v23, v2

    invoke-direct/range {v17 .. v23}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda14;-><init>(Landroid/widget/TextView;[I[Ljava/lang/String;Ljava/lang/String;Landroid/os/Handler;[Ljava/lang/Runnable;)V

    aput-object v5, v2, v4

    .line 1567
    aget-object v2, v2, v4

    const-wide/16 v3, 0x64

    invoke-virtual {v1, v2, v3, v4}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private applyAutomationBlockStatus()V
    .locals 12

    .line 716
    const-string v0, "instagram"

    const-string v1, "youtube"

    const-string v2, "threads"

    const-string v3, "tiktok"

    filled-new-array {v0, v1, v2, v3}, [Ljava/lang/String;

    move-result-object v4

    const/4 v5, 0x0

    const/4 v6, 0x0

    :goto_0
    const/4 v7, 0x1

    const/4 v8, 0x4

    if-ge v6, v8, :cond_7

    .line 717
    aget-object v8, v4, v6

    .line 718
    iget-object v9, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v9, v8}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v9

    if-nez v9, :cond_0

    goto/16 :goto_3

    .line 719
    :cond_0
    iget-object v9, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v9, v8}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    if-eqz v9, :cond_6

    .line 720
    invoke-virtual {v9}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/String;->isEmpty()Z

    move-result v10

    if-eqz v10, :cond_1

    goto/16 :goto_3

    .line 721
    :cond_1
    invoke-virtual {v8}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v8}, Ljava/lang/String;->hashCode()I

    move-result v10

    const/4 v11, -0x1

    sparse-switch v10, :sswitch_data_0

    :goto_1
    const/4 v7, -0x1

    goto :goto_2

    :sswitch_0
    invoke-virtual {v8, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_2

    goto :goto_1

    :cond_2
    const/4 v7, 0x3

    goto :goto_2

    :sswitch_1
    invoke-virtual {v8, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_3

    goto :goto_1

    :cond_3
    const/4 v7, 0x2

    goto :goto_2

    :sswitch_2
    invoke-virtual {v8, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-nez v8, :cond_5

    goto :goto_1

    :sswitch_3
    invoke-virtual {v8, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_4

    goto :goto_1

    :cond_4
    const/4 v7, 0x0

    :cond_5
    :goto_2
    const-string v8, "\u25b6\ufe0f Lancer"

    const-string v10, "\u26a0 "

    packed-switch v7, :pswitch_data_0

    goto/16 :goto_3

    .line 723
    :pswitch_0
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvInstaStatus:Landroid/widget/TextView;

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v11, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 724
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvInstaStatus:Landroid/widget/TextView;

    sget v9, Lcom/prsocial/app/R$color;->error_red:I

    invoke-static {p0, v9}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setTextColor(I)V

    .line 725
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    invoke-virtual {v7, v8}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    .line 726
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    invoke-virtual {v7, v5}, Landroid/widget/Button;->setEnabled(Z)V

    goto :goto_3

    .line 739
    :pswitch_1
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvTikTokStatus:Landroid/widget/TextView;

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v11, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 740
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvTikTokStatus:Landroid/widget/TextView;

    sget v9, Lcom/prsocial/app/R$color;->error_red:I

    invoke-static {p0, v9}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setTextColor(I)V

    .line 741
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    invoke-virtual {v7, v8}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    goto :goto_3

    .line 729
    :pswitch_2
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvYouTubeStatus:Landroid/widget/TextView;

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v11, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 730
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvYouTubeStatus:Landroid/widget/TextView;

    sget v9, Lcom/prsocial/app/R$color;->error_red:I

    invoke-static {p0, v9}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setTextColor(I)V

    .line 731
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    invoke-virtual {v7, v8}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    goto :goto_3

    .line 734
    :pswitch_3
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvThreadsStatus:Landroid/widget/TextView;

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v11, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 735
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->tvThreadsStatus:Landroid/widget/TextView;

    sget v9, Lcom/prsocial/app/R$color;->error_red:I

    invoke-static {p0, v9}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result v9

    invoke-virtual {v7, v9}, Landroid/widget/TextView;->setTextColor(I)V

    .line 736
    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    invoke-virtual {v7, v8}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    :cond_6
    :goto_3
    add-int/lit8 v6, v6, 0x1

    goto/16 :goto_0

    .line 745
    :cond_7
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v1, v0}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_8

    .line 746
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    invoke-virtual {v0, v7}, Landroid/widget/Button;->setEnabled(Z)V

    :cond_8
    return-void

    nop

    :sswitch_data_0
    .sparse-switch
        -0x4fbf4c57 -> :sswitch_3
        -0x3b1cd4dd -> :sswitch_2
        -0x3413cf06 -> :sswitch_1
        0x1b907b2 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private applyPlatformButtonStates()V
    .locals 2

    .line 679
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    const-string v1, "tiktok"

    invoke-direct {p0, v1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v1

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->setButtonLinkedState(Landroid/widget/Button;Z)V

    .line 680
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    const-string v1, "threads"

    invoke-direct {p0, v1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v1

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->setButtonLinkedState(Landroid/widget/Button;Z)V

    .line 681
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    const-string v1, "youtube"

    invoke-direct {p0, v1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v1

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->setButtonLinkedState(Landroid/widget/Button;Z)V

    return-void
.end method

.method private bindMultiPanel()V
    .locals 11

    .line 2178
    sget v0, Lcom/prsocial/app/R$id;->multi_log_container:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    .line 2179
    sget v0, Lcom/prsocial/app/R$id;->multi_log_scroll:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroidx/core/widget/NestedScrollView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    .line 2180
    sget v0, Lcom/prsocial/app/R$id;->multi_log_header:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogHeader:Landroid/widget/LinearLayout;

    .line 2181
    sget v0, Lcom/prsocial/app/R$id;->btn_multi_launch:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnMultiLaunch:Landroid/widget/Button;

    .line 2182
    sget v0, Lcom/prsocial/app/R$id;->multi_overlay:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->multiOverlay:Landroid/widget/LinearLayout;

    .line 2184
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    if-eqz v0, :cond_0

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Landroidx/core/widget/NestedScrollView;->setNestedScrollingEnabled(Z)V

    .line 2187
    :cond_0
    sget-object v0, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORMS:[Ljava/lang/String;

    array-length v1, v0

    const/4 v2, 0x0

    const/4 v3, 0x0

    :goto_0
    if-ge v3, v1, :cond_1

    aget-object v4, v0, v3

    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->multiEnabled:Ljava/util/Map;

    invoke-static {v2}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v6

    invoke-interface {v5, v4, v6}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    add-int/lit8 v3, v3, 0x1

    goto :goto_0

    .line 2190
    :cond_1
    sget v0, Lcom/prsocial/app/R$id;->multi_toggles_container:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    if-eqz v0, :cond_2

    const/4 v1, 0x0

    .line 2192
    :goto_1
    sget-object v3, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORMS:[Ljava/lang/String;

    array-length v4, v3

    if-ge v1, v4, :cond_2

    .line 2193
    aget-object v3, v3, v1

    .line 2194
    sget-object v4, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORM_EMOJIS:[Ljava/lang/String;

    aget-object v4, v4, v1

    .line 2195
    sget-object v5, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORM_NAMES:[Ljava/lang/String;

    aget-object v5, v5, v1

    .line 2197
    new-instance v6, Landroid/widget/LinearLayout;

    invoke-direct {v6, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    .line 2198
    invoke-virtual {v6, v2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    const/16 v7, 0x10

    .line 2199
    invoke-virtual {v6, v7}, Landroid/widget/LinearLayout;->setGravity(I)V

    .line 2200
    new-instance v7, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v8, -0x1

    const/4 v9, -0x2

    invoke-direct {v7, v8, v9}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    const/16 v10, 0x8

    .line 2203
    invoke-direct {p0, v10}, Lcom/prsocial/app/MainActivity;->dpToPx(I)I

    move-result v10

    invoke-virtual {v7, v2, v2, v2, v10}, Landroid/widget/LinearLayout$LayoutParams;->setMargins(IIII)V

    .line 2204
    invoke-virtual {v6, v7}, Landroid/widget/LinearLayout;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 2206
    new-instance v7, Landroid/widget/TextView;

    invoke-direct {v7, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 2207
    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v10, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v4, " "

    invoke-virtual {v10, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v10, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v7, v4}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 2208
    invoke-virtual {v7, v8}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 v4, 0x41500000    # 13.0f

    .line 2209
    invoke-virtual {v7, v4}, Landroid/widget/TextView;->setTextSize(F)V

    .line 2210
    new-instance v4, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v5, 0x3f800000    # 1.0f

    invoke-direct {v4, v2, v9, v5}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    .line 2212
    invoke-virtual {v7, v4}, Landroid/widget/TextView;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 2213
    invoke-virtual {v6, v7}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 2215
    new-instance v4, Landroid/widget/Button;

    invoke-direct {v4, p0}, Landroid/widget/Button;-><init>(Landroid/content/Context;)V

    .line 2216
    const-string v5, "OFF"

    invoke-virtual {v4, v5}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    const/high16 v5, 0x41300000    # 11.0f

    .line 2217
    invoke-virtual {v4, v5}, Landroid/widget/Button;->setTextSize(F)V

    .line 2218
    invoke-virtual {v4, v8}, Landroid/widget/Button;->setTextColor(I)V

    const v5, -0xbbbb9a

    .line 2219
    invoke-virtual {v4, v5}, Landroid/widget/Button;->setBackgroundColor(I)V

    .line 2220
    new-instance v5, Landroid/widget/LinearLayout$LayoutParams;

    const/16 v7, 0x40

    .line 2221
    invoke-direct {p0, v7}, Lcom/prsocial/app/MainActivity;->dpToPx(I)I

    move-result v7

    const/16 v8, 0x20

    invoke-direct {p0, v8}, Lcom/prsocial/app/MainActivity;->dpToPx(I)I

    move-result v8

    invoke-direct {v5, v7, v8}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    .line 2222
    invoke-virtual {v4, v5}, Landroid/widget/Button;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 2223
    invoke-virtual {v4, v2, v2, v2, v2}, Landroid/widget/Button;->setPadding(IIII)V

    .line 2224
    new-instance v5, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda50;

    invoke-direct {v5, p0, v3, v4}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda50;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Landroid/widget/Button;)V

    invoke-virtual {v4, v5}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 2230
    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->multiToggleBtns:Ljava/util/Map;

    invoke-interface {v5, v3, v4}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 2231
    invoke-virtual {v6, v4}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 2232
    invoke-virtual {v0, v6}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    add-int/lit8 v1, v1, 0x1

    goto/16 :goto_1

    .line 2236
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnMultiLaunch:Landroid/widget/Button;

    if-eqz v0, :cond_3

    .line 2237
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda51;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda51;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 2246
    :cond_3
    sget v0, Lcom/prsocial/app/R$id;->tv_multi_log_clear:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    if-eqz v0, :cond_4

    .line 2247
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda52;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda52;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    :cond_4
    return-void
.end method

.method private bindViews()V
    .locals 3

    .line 332
    sget v0, Lcom/prsocial/app/R$id;->tv_balance:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvBalance:Landroid/widget/TextView;

    .line 333
    sget v0, Lcom/prsocial/app/R$id;->tv_earned:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvEarned:Landroid/widget/TextView;

    .line 334
    sget v0, Lcom/prsocial/app/R$id;->tv_streak:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvStreak:Landroid/widget/TextView;

    .line 335
    sget v0, Lcom/prsocial/app/R$id;->tv_approved:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvApproved:Landroid/widget/TextView;

    .line 336
    sget v0, Lcom/prsocial/app/R$id;->tv_pending:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvPending:Landroid/widget/TextView;

    .line 337
    sget v0, Lcom/prsocial/app/R$id;->tv_abandoned:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvAbandoned:Landroid/widget/TextView;

    .line 338
    sget v0, Lcom/prsocial/app/R$id;->tv_today_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTodayTasks:Landroid/widget/TextView;

    .line 339
    sget v0, Lcom/prsocial/app/R$id;->tv_today_earned:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTodayEarned:Landroid/widget/TextView;

    .line 340
    sget v0, Lcom/prsocial/app/R$id;->tv_week_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvWeekTasks:Landroid/widget/TextView;

    .line 341
    sget v0, Lcom/prsocial/app/R$id;->tv_week_earned:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvWeekEarned:Landroid/widget/TextView;

    .line 342
    sget v0, Lcom/prsocial/app/R$id;->tv_month_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvMonthTasks:Landroid/widget/TextView;

    .line 343
    sget v0, Lcom/prsocial/app/R$id;->tv_month_earned:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvMonthEarned:Landroid/widget/TextView;

    .line 344
    sget v0, Lcom/prsocial/app/R$id;->tv_insta_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvInstaStatus:Landroid/widget/TextView;

    .line 345
    sget v0, Lcom/prsocial/app/R$id;->swipe_refresh:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->swipeRefresh:Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

    .line 347
    sget v0, Lcom/prsocial/app/R$id;->tv_profile_username:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvProfileUsername:Landroid/widget/TextView;

    .line 348
    sget v0, Lcom/prsocial/app/R$id;->tv_profile_email:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvProfileEmail:Landroid/widget/TextView;

    .line 349
    sget v0, Lcom/prsocial/app/R$id;->tv_profile_id:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvProfileId:Landroid/widget/TextView;

    .line 350
    sget v0, Lcom/prsocial/app/R$id;->tv_profile_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvProfileStatus:Landroid/widget/TextView;

    .line 351
    sget v0, Lcom/prsocial/app/R$id;->btn_toggle_email:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnToggleEmail:Landroid/widget/TextView;

    if-eqz v0, :cond_0

    .line 353
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda32;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda32;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 358
    :cond_0
    sget v0, Lcom/prsocial/app/R$id;->task_list_container:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->taskListContainer:Landroid/widget/LinearLayout;

    .line 359
    sget v0, Lcom/prsocial/app/R$id;->task_progress:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/ProgressBar;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->taskProgress:Landroid/widget/ProgressBar;

    .line 360
    sget v0, Lcom/prsocial/app/R$id;->btn_load_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    .line 361
    sget v0, Lcom/prsocial/app/R$id;->btn_instagram_account:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnInstagram:Landroid/widget/Button;

    .line 363
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->swipeRefresh:Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

    sget v1, Lcom/prsocial/app/R$color;->accent_purple:I

    sget v2, Lcom/prsocial/app/R$color;->accent_blue:I

    filled-new-array {v1, v2}, [I

    move-result-object v1

    invoke-virtual {v0, v1}, Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;->setColorSchemeResources([I)V

    .line 364
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->swipeRefresh:Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda38;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda38;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;->setOnRefreshListener(Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout$OnRefreshListener;)V

    .line 371
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda39;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda39;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 380
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnInstagram:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda40;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda40;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 390
    sget v0, Lcom/prsocial/app/R$id;->tv_tiktok_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTikTokStatus:Landroid/widget/TextView;

    .line 391
    sget v0, Lcom/prsocial/app/R$id;->btn_tiktok_account:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnTikTok:Landroid/widget/Button;

    .line 392
    sget v0, Lcom/prsocial/app/R$id;->btn_load_tiktok_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    .line 393
    sget v0, Lcom/prsocial/app/R$id;->task_progress_tiktok:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/ProgressBar;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->progressTikTok:Landroid/widget/ProgressBar;

    .line 394
    sget v0, Lcom/prsocial/app/R$id;->task_list_tiktok:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->containerTikTok:Landroid/widget/LinearLayout;

    .line 395
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnTikTok:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda41;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda41;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 396
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda42;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda42;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 407
    sget v0, Lcom/prsocial/app/R$id;->tv_threads_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvThreadsStatus:Landroid/widget/TextView;

    .line 408
    sget v0, Lcom/prsocial/app/R$id;->btn_threads_account:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnThreads:Landroid/widget/Button;

    .line 409
    sget v0, Lcom/prsocial/app/R$id;->btn_load_threads_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    .line 410
    sget v0, Lcom/prsocial/app/R$id;->task_progress_threads:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/ProgressBar;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->progressThreads:Landroid/widget/ProgressBar;

    .line 411
    sget v0, Lcom/prsocial/app/R$id;->task_list_threads:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->containerThreads:Landroid/widget/LinearLayout;

    .line 412
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnThreads:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda43;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda43;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 413
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda45;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda45;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 424
    sget v0, Lcom/prsocial/app/R$id;->tv_youtube_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvYouTubeStatus:Landroid/widget/TextView;

    .line 425
    sget v0, Lcom/prsocial/app/R$id;->btn_youtube_account:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnYouTube:Landroid/widget/Button;

    .line 426
    sget v0, Lcom/prsocial/app/R$id;->btn_load_youtube_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    .line 427
    sget v0, Lcom/prsocial/app/R$id;->task_progress_youtube:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/ProgressBar;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->progressYouTube:Landroid/widget/ProgressBar;

    .line 428
    sget v0, Lcom/prsocial/app/R$id;->task_list_youtube:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->containerYouTube:Landroid/widget/LinearLayout;

    .line 429
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnYouTube:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda46;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda46;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 430
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda47;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda47;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 441
    sget v0, Lcom/prsocial/app/R$id;->tv_telegram_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTelegramStatus:Landroid/widget/TextView;

    .line 442
    sget v0, Lcom/prsocial/app/R$id;->btn_telegram_account:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnTelegramAccount:Landroid/widget/Button;

    .line 443
    sget v0, Lcom/prsocial/app/R$id;->btn_load_telegram_tasks:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTelegram:Landroid/widget/Button;

    .line 444
    sget v0, Lcom/prsocial/app/R$id;->task_progress_telegram:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/ProgressBar;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->progressTelegram:Landroid/widget/ProgressBar;

    .line 445
    sget v0, Lcom/prsocial/app/R$id;->task_list_telegram:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->containerTelegram:Landroid/widget/LinearLayout;

    .line 446
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->updateTelegramStatusUI()V

    .line 449
    sget v0, Lcom/prsocial/app/R$id;->btn_telegram_web:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    if-eqz v0, :cond_1

    .line 451
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda34;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda34;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 455
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnTelegramAccount:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda35;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda35;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 462
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTelegram:Landroid/widget/Button;

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda36;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda36;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 475
    sget v0, Lcom/prsocial/app/R$id;->btn_logout:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda37;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda37;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    return-void
.end method

.method private checkAllSocialAccounts()V
    .locals 2

    .line 609
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/MainActivity$5;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$5;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {v0, v1}, Lcom/prsocial/app/ApiClient;->getSocials(Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private clearStatusRow()V
    .locals 1

    .line 1613
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda49;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda49;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private clearTaskLog()V
    .locals 3

    const/4 v0, 0x0

    .line 1720
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    .line 1721
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRowContainer:Landroid/widget/LinearLayout;

    .line 1722
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogContainer()Landroid/widget/LinearLayout;

    move-result-object v0

    .line 1723
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogScroll()Landroidx/core/widget/NestedScrollView;

    move-result-object v1

    .line 1724
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogHeader()Landroid/widget/LinearLayout;

    move-result-object v2

    if-eqz v0, :cond_0

    .line 1725
    invoke-virtual {v0}, Landroid/widget/LinearLayout;->removeAllViews()V

    :cond_0
    const/16 v0, 0x8

    if-eqz v1, :cond_1

    .line 1726
    invoke-virtual {v1, v0}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    :cond_1
    if-eqz v2, :cond_2

    .line 1727
    invoke-virtual {v2, v0}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_2
    return-void
.end method

.method private dpToPx(I)I
    .locals 1

    int-to-float p1, p1

    .line 2260
    invoke-virtual {p0}, Lcom/prsocial/app/MainActivity;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->density:F

    mul-float p1, p1, v0

    invoke-static {p1}, Ljava/lang/Math;->round(F)I

    move-result p1

    return p1
.end method

.method private executeTelegramJoin(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2

    .line 1934
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\u2708 JOIN "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, "..."

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const v1, -0xab5615

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    .line 1935
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda68;

    invoke-direct {v0, p0, p2, p1, p3}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda68;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p0, p2, v0}, Lcom/prsocial/app/TelegramActionClient;->performJoin(Landroid/content/Context;Ljava/lang/String;Lcom/prsocial/app/TelegramActionClient$TgResultCallback;)V

    return-void
.end method

.method private extractActionType(Ljava/lang/String;)Ljava/lang/String;
    .locals 3

    .line 1358
    const-string v0, ""

    if-nez p1, :cond_0

    return-object v0

    .line 1359
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object p1

    .line 1360
    const-string v1, "follow"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    const-string v2, "FOLLOW"

    if-eqz v1, :cond_1

    return-object v2

    .line 1361
    :cond_1
    const-string v1, "subscribe"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_2

    return-object v2

    .line 1362
    :cond_2
    const-string v1, "like"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_3

    const-string p1, "LIKE"

    return-object p1

    .line 1363
    :cond_3
    const-string v1, "comment"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_4

    const-string p1, "COMMENT"

    return-object p1

    .line 1364
    :cond_4
    const-string v1, "view"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_5

    const-string p1, "VIEW"

    return-object p1

    .line 1365
    :cond_5
    const-string v1, "share"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_6

    const-string p1, "SHARE"

    return-object p1

    .line 1366
    :cond_6
    const-string v1, "save"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_7

    const-string p1, "SAVE"

    return-object p1

    .line 1367
    :cond_7
    const-string v1, "story"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_8

    const-string p1, "STORY"

    return-object p1

    .line 1368
    :cond_8
    const-string v1, "reel"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_9

    const-string p1, "REEL"

    return-object p1

    .line 1369
    :cond_9
    const-string v1, "vote"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    if-eqz p1, :cond_a

    const-string p1, "VOTE"

    return-object p1

    :cond_a
    return-object v0
.end method

.method private fetchAllMultiTasks()V
    .locals 5

    .line 2300
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->size()I

    move-result v0

    filled-new-array {v0}, [I

    move-result-object v0

    .line 2301
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_0

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 2302
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "\u23f3 R\u00e9cup\u00e9ration t\u00e2ches "

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v4, "..."

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    const v4, -0x5f4f01

    invoke-direct {p0, v3, v4}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2303
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v4, Lcom/prsocial/app/MainActivity$19;

    invoke-direct {v4, p0, v2, v0}, Lcom/prsocial/app/MainActivity$19;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;[I)V

    invoke-static {v3, v2, v4}, Lcom/prsocial/app/ApiClient;->getAvailableTasks(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    goto :goto_0

    :cond_0
    return-void
.end method

.method private getActiveLogContainer()Landroid/widget/LinearLayout;
    .locals 3

    .line 1684
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_4

    .line 1685
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "tiktok"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/4 v2, 0x3

    goto :goto_0

    :sswitch_1
    const-string v1, "youtube"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v2, 0x2

    goto :goto_0

    :sswitch_2
    const-string v1, "threads"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_0

    :cond_2
    const/4 v2, 0x1

    goto :goto_0

    :sswitch_3
    const-string v1, "telegram"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    goto :goto_0

    :cond_3
    const/4 v2, 0x0

    :goto_0
    packed-switch v2, :pswitch_data_0

    goto :goto_1

    .line 1686
    :pswitch_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTikTok:Landroid/widget/LinearLayout;

    return-object v0

    .line 1688
    :pswitch_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerYouTube:Landroid/widget/LinearLayout;

    return-object v0

    .line 1687
    :pswitch_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerThreads:Landroid/widget/LinearLayout;

    return-object v0

    .line 1689
    :pswitch_3
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTelegram:Landroid/widget/LinearLayout;

    return-object v0

    .line 1692
    :cond_4
    :goto_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogContainer:Landroid/widget/LinearLayout;

    return-object v0

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private getActiveLogHeader()Landroid/widget/LinearLayout;
    .locals 3

    .line 1708
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_4

    .line 1709
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "tiktok"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/4 v2, 0x3

    goto :goto_0

    :sswitch_1
    const-string v1, "youtube"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v2, 0x2

    goto :goto_0

    :sswitch_2
    const-string v1, "threads"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_0

    :cond_2
    const/4 v2, 0x1

    goto :goto_0

    :sswitch_3
    const-string v1, "telegram"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    goto :goto_0

    :cond_3
    const/4 v2, 0x0

    :goto_0
    packed-switch v2, :pswitch_data_0

    goto :goto_1

    .line 1710
    :pswitch_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderTikTok:Landroid/widget/LinearLayout;

    return-object v0

    .line 1712
    :pswitch_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderYouTube:Landroid/widget/LinearLayout;

    return-object v0

    .line 1711
    :pswitch_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderThreads:Landroid/widget/LinearLayout;

    return-object v0

    .line 1713
    :pswitch_3
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderTelegram:Landroid/widget/LinearLayout;

    return-object v0

    .line 1716
    :cond_4
    :goto_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogHeader:Landroid/widget/LinearLayout;

    return-object v0

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private getActiveLogScroll()Landroidx/core/widget/NestedScrollView;
    .locals 3

    .line 1696
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_4

    .line 1697
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "tiktok"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/4 v2, 0x3

    goto :goto_0

    :sswitch_1
    const-string v1, "youtube"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v2, 0x2

    goto :goto_0

    :sswitch_2
    const-string v1, "threads"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_0

    :cond_2
    const/4 v2, 0x1

    goto :goto_0

    :sswitch_3
    const-string v1, "telegram"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    goto :goto_0

    :cond_3
    const/4 v2, 0x0

    :goto_0
    packed-switch v2, :pswitch_data_0

    goto :goto_1

    .line 1698
    :pswitch_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTikTok:Landroidx/core/widget/NestedScrollView;

    return-object v0

    .line 1700
    :pswitch_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollYouTube:Landroidx/core/widget/NestedScrollView;

    return-object v0

    .line 1699
    :pswitch_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollThreads:Landroidx/core/widget/NestedScrollView;

    return-object v0

    .line 1701
    :pswitch_3
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTelegram:Landroidx/core/widget/NestedScrollView;

    return-object v0

    .line 1704
    :cond_4
    :goto_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskLogScroll:Landroidx/core/widget/NestedScrollView;

    return-object v0

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private getButtonForPlatform(Ljava/lang/String;)Landroid/widget/Button;
    .locals 2

    .line 1041
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    const/4 v1, -0x1

    sparse-switch v0, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v0, "tiktok"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    goto :goto_0

    :cond_0
    const/4 v1, 0x3

    goto :goto_0

    :sswitch_1
    const-string v0, "youtube"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v1, 0x2

    goto :goto_0

    :sswitch_2
    const-string v0, "threads"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v1, 0x1

    goto :goto_0

    :sswitch_3
    const-string v0, "telegram"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v1, 0x0

    :goto_0
    packed-switch v1, :pswitch_data_0

    .line 1046
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    return-object p1

    .line 1042
    :pswitch_0
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    return-object p1

    .line 1044
    :pswitch_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    return-object p1

    .line 1043
    :pswitch_2
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    return-object p1

    .line 1045
    :pswitch_3
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->btnLoadTelegram:Landroid/widget/Button;

    return-object p1

    nop

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private getLogContainerForPlatform(Ljava/lang/String;)Landroid/widget/LinearLayout;
    .locals 2

    if-nez p1, :cond_0

    .line 1673
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainer:Landroid/widget/LinearLayout;

    return-object p1

    .line 1674
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    const/4 v1, -0x1

    sparse-switch v0, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v0, "tiktok"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v1, 0x3

    goto :goto_0

    :sswitch_1
    const-string v0, "youtube"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v1, 0x2

    goto :goto_0

    :sswitch_2
    const-string v0, "threads"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v1, 0x1

    goto :goto_0

    :sswitch_3
    const-string v0, "telegram"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_4

    goto :goto_0

    :cond_4
    const/4 v1, 0x0

    :goto_0
    packed-switch v1, :pswitch_data_0

    .line 1679
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainer:Landroid/widget/LinearLayout;

    return-object p1

    .line 1675
    :pswitch_0
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTikTok:Landroid/widget/LinearLayout;

    return-object p1

    .line 1677
    :pswitch_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerYouTube:Landroid/widget/LinearLayout;

    return-object p1

    .line 1676
    :pswitch_2
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerThreads:Landroid/widget/LinearLayout;

    return-object p1

    .line 1678
    :pswitch_3
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTelegram:Landroid/widget/LinearLayout;

    return-object p1

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private getProgressForPlatform(Ljava/lang/String;)Landroid/widget/ProgressBar;
    .locals 2

    .line 1031
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    const/4 v1, -0x1

    sparse-switch v0, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v0, "tiktok"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    goto :goto_0

    :cond_0
    const/4 v1, 0x3

    goto :goto_0

    :sswitch_1
    const-string v0, "youtube"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v1, 0x2

    goto :goto_0

    :sswitch_2
    const-string v0, "threads"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v1, 0x1

    goto :goto_0

    :sswitch_3
    const-string v0, "telegram"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v1, 0x0

    :goto_0
    packed-switch v1, :pswitch_data_0

    .line 1036
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskProgress:Landroid/widget/ProgressBar;

    return-object p1

    .line 1032
    :pswitch_0
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->progressTikTok:Landroid/widget/ProgressBar;

    return-object p1

    .line 1034
    :pswitch_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->progressYouTube:Landroid/widget/ProgressBar;

    return-object p1

    .line 1033
    :pswitch_2
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->progressThreads:Landroid/widget/ProgressBar;

    return-object p1

    .line 1035
    :pswitch_3
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->progressTelegram:Landroid/widget/ProgressBar;

    return-object p1

    nop

    :sswitch_data_0
    .sparse-switch
        -0x511716ff -> :sswitch_3
        -0x4fbf4c57 -> :sswitch_2
        -0x3b1cd4dd -> :sswitch_1
        -0x3413cf06 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_3
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private handleHttpActionFailure(Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;)V
    .locals 6

    .line 1437
    iget-object v0, p2, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->isTargetUnavailableState(Ljava/lang/String;)Z

    move-result v0

    const/4 v1, 0x0

    if-eqz v0, :cond_0

    .line 1439
    new-instance p3, Ljava/lang/StringBuilder;

    invoke-direct {p3}, Ljava/lang/StringBuilder;-><init>()V

    iget-object p2, p2, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {p3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p2, " \u2192 report"

    invoke-virtual {p3, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    const-string p3, ""

    invoke-direct {p0, p3, p3, v1, p2}, Lcom/prsocial/app/MainActivity;->appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    .line 1440
    iget-object p2, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance p3, Lcom/prsocial/app/MainActivity$12;

    invoke-direct {p3, p0}, Lcom/prsocial/app/MainActivity$12;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {p2, p1, p3}, Lcom/prsocial/app/ApiClient;->reportTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void

    .line 1457
    :cond_0
    iget-object v0, p2, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->isCriticalAccountState(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_7

    .line 1458
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const/4 v2, 0x1

    invoke-virtual {p3, v1, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->toUpperCase()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p3, v2}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 1460
    iget-object v3, p2, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v3}, Ljava/lang/String;->hashCode()I

    invoke-virtual {v3}, Ljava/lang/String;->hashCode()I

    move-result v4

    const/4 v5, -0x1

    sparse-switch v4, :sswitch_data_0

    :goto_0
    const/4 v1, -0x1

    goto :goto_1

    :sswitch_0
    const-string v1, "NO_SESSION"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v1, 0x5

    goto :goto_1

    :sswitch_1
    const-string v1, "SUSPENDED"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v1, 0x4

    goto :goto_1

    :sswitch_2
    const-string v1, "DISABLED"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v1, 0x3

    goto :goto_1

    :sswitch_3
    const-string v1, "CHALLENGE"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    goto :goto_0

    :cond_4
    const/4 v1, 0x2

    goto :goto_1

    :sswitch_4
    const-string v1, "RATE_LIMIT"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_5

    goto :goto_0

    :cond_5
    const/4 v1, 0x1

    goto :goto_1

    :sswitch_5
    const-string v2, "NOT_LOGGED_IN"

    invoke-virtual {v3, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_6

    goto :goto_0

    .line 1472
    :cond_6
    :goto_1
    const-string v2, " d\u00e9tect\u00e9."

    const-string v3, "Compte "

    packed-switch v1, :pswitch_data_0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "Automatisation stopp\u00e9e "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, ": "

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v0, p2, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    .line 1464
    :pswitch_0
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, " suspendu."

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    .line 1466
    :pswitch_1
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, " d\u00e9sactiv\u00e9."

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    .line 1470
    :pswitch_2
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "Challenge "

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    .line 1468
    :pswitch_3
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "Rate limit "

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    .line 1462
    :pswitch_4
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, " d\u00e9connect\u00e9. Reconnectez le compte et relancez."

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 1475
    :goto_2
    new-instance v1, Lcom/prsocial/app/SessionManager;

    invoke-direct {v1, p0}, Lcom/prsocial/app/SessionManager;-><init>(Landroid/content/Context;)V

    iget-object p2, p2, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v1, p3, p2, v0}, Lcom/prsocial/app/SessionManager;->saveAutomationBlockForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1476
    invoke-direct {p0, p3}, Lcom/prsocial/app/MainActivity;->getLogContainerForPlatform(Ljava/lang/String;)Landroid/widget/LinearLayout;

    move-result-object p2

    invoke-static {p0, p3, v0, p2}, Lcom/prsocial/app/AlertSoundManager;->playAlert(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Landroid/widget/LinearLayout;)V

    .line 1477
    iget-object p2, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/MainActivity$13;

    invoke-direct {v1, p0, p3, v0}, Lcom/prsocial/app/MainActivity$13;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p2, p1, v1}, Lcom/prsocial/app/ApiClient;->cancelTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void

    .line 1504
    :cond_7
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz p1, :cond_8

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeCurrentManualTaskAndLoadNext()V

    goto :goto_3

    .line 1505
    :cond_8
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeCurrentTaskAndLoadNext()V

    :goto_3
    return-void

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

.method private isCriticalAccountState(Ljava/lang/String;)Z
    .locals 4

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1520
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

.method private isCriticalTelegramState(Ljava/lang/String;)Z
    .locals 4

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1990
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v1

    const/4 v2, 0x1

    const/4 v3, -0x1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "SUSPENDED"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    goto :goto_0

    :cond_1
    const/4 v3, 0x2

    goto :goto_0

    :sswitch_1
    const-string v1, "RATE_LIMIT"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 v3, 0x1

    goto :goto_0

    :sswitch_2
    const-string v1, "NOT_LOGGED_IN"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_3

    goto :goto_0

    :cond_3
    const/4 v3, 0x0

    :goto_0
    packed-switch v3, :pswitch_data_0

    return v0

    :pswitch_0
    return v2

    :sswitch_data_0
    .sparse-switch
        -0x36395d8a -> :sswitch_2
        -0x1cbb2c84 -> :sswitch_1
        0x430d9dbb -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_0
        :pswitch_0
        :pswitch_0
    .end packed-switch
.end method

.method private isPlatformLinked(Ljava/lang/String;)Z
    .locals 2

    .line 74
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->platformLinked:Ljava/util/Map;

    sget-object v1, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p1, v1}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p1

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Ljava/lang/Boolean;

    if-eqz p1, :cond_0

    .line 75
    invoke-virtual {p1}, Ljava/lang/Boolean;->booleanValue()Z

    move-result p1

    if-eqz p1, :cond_0

    const/4 p1, 0x1

    goto :goto_0

    :cond_0
    const/4 p1, 0x0

    :goto_0
    return p1
.end method

.method private isSkippableAction(Ljava/lang/String;Ljava/lang/String;)Z
    .locals 2

    const/4 v0, 0x1

    if-eqz p1, :cond_4

    .line 1051
    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_2

    .line 1053
    :cond_0
    const-string v1, "twitter"

    invoke-virtual {v1, p2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p2

    if-eqz p2, :cond_1

    return v0

    .line 1055
    :cond_1
    const-string p2, "LIKE"

    invoke-virtual {p2, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p2

    if-nez p2, :cond_3

    const-string p2, "FOLLOW"

    .line 1056
    invoke-virtual {p2, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_2

    goto :goto_0

    :cond_2
    const/4 p1, 0x0

    goto :goto_1

    :cond_3
    :goto_0
    const/4 p1, 0x1

    :goto_1
    xor-int/2addr p1, v0

    return p1

    :cond_4
    :goto_2
    return v0
.end method

.method private isTargetUnavailableState(Ljava/lang/String;)Z
    .locals 4

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1510
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

.method static synthetic lambda$appendActiveLog$59(Landroidx/core/widget/NestedScrollView;)V
    .locals 1

    const/16 v0, 0x82

    .line 2489
    invoke-virtual {p0, v0}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method static synthetic lambda$appendCountdownThenNext$64(Landroidx/core/widget/NestedScrollView;)V
    .locals 1

    const/16 v0, 0x82

    .line 2566
    invoke-virtual {p0, v0}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method static synthetic lambda$appendCountdownThenNext$65(Landroid/widget/TextView;)V
    .locals 1

    .line 2581
    invoke-virtual {p0}, Landroid/widget/TextView;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    instance-of v0, v0, Landroid/view/ViewGroup;

    if-eqz v0, :cond_0

    .line 2582
    invoke-virtual {p0}, Landroid/widget/TextView;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    check-cast v0, Landroid/view/ViewGroup;

    invoke-virtual {v0, p0}, Landroid/view/ViewGroup;->removeView(Landroid/view/View;)V

    :cond_0
    return-void
.end method

.method static synthetic lambda$appendCountdownThenNext$66([ILandroid/widget/TextView;Landroid/os/Handler;[Ljava/lang/Runnable;)V
    .locals 5

    const/4 v0, 0x0

    .line 2572
    aget v1, p0, v0

    const-wide/16 v2, 0x3e8

    if-lez v1, :cond_0

    .line 2573
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v4, "\u23f3 Prochaine t\u00e2che dans "

    invoke-direct {v1, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    aget v4, p0, v0

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v4, "s..."

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {p1, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 2574
    aget p1, p0, v0

    add-int/lit8 p1, p1, -0x1

    aput p1, p0, v0

    .line 2575
    aget-object p0, p3, v0

    invoke-virtual {p2, p0, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_0

    .line 2577
    :cond_0
    const-string p0, "\u2705 T\u00e2che suivante !"

    invoke-virtual {p1, p0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    const p0, -0xaf2267

    .line 2578
    invoke-virtual {p1, p0}, Landroid/widget/TextView;->setTextColor(I)V

    .line 2580
    new-instance p0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda63;

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda63;-><init>(Landroid/widget/TextView;)V

    invoke-virtual {p2, p0, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    :goto_0
    return-void
.end method

.method static synthetic lambda$appendLog$41(Landroidx/core/widget/NestedScrollView;)V
    .locals 1

    const/16 v0, 0x82

    .line 1668
    invoke-virtual {p0, v0}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method static synthetic lambda$appendLogForPlatform$62(Landroidx/core/widget/NestedScrollView;)V
    .locals 1

    const/16 v0, 0x82

    .line 2548
    invoke-virtual {p0, v0}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method static synthetic lambda$appendSpinnerRow$35(Landroidx/core/widget/NestedScrollView;)V
    .locals 1

    const/16 v0, 0x82

    .line 1558
    invoke-virtual {p0, v0}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method static synthetic lambda$appendSpinnerRow$36(Landroid/widget/TextView;[I[Ljava/lang/String;Ljava/lang/String;Landroid/os/Handler;[Ljava/lang/Runnable;)V
    .locals 3

    .line 1562
    invoke-virtual {p0}, Landroid/widget/TextView;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    if-nez v0, :cond_0

    return-void

    :cond_0
    const/4 v0, 0x0

    .line 1563
    aget v1, p1, v0

    add-int/lit8 v1, v1, 0x1

    array-length v2, p2

    rem-int/2addr v1, v2

    aput v1, p1, v0

    .line 1564
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    aget p1, p1, v0

    aget-object p1, p2, p1

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p1, " "

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 1565
    aget-object p0, p5, v0

    const-wide/16 p1, 0x64

    invoke-virtual {p4, p0, p1, p2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method static synthetic lambda$setStatusRow$37(Landroidx/core/widget/NestedScrollView;)V
    .locals 1

    const/16 v0, 0x82

    .line 1607
    invoke-virtual {p0, v0}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method private launchCurrentManualTask()V
    .locals 0

    .line 845
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTaskInner()V

    return-void
.end method

.method private launchCurrentManualTaskInner()V
    .locals 11

    .line 849
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    const/4 v2, 0x1

    if-lt v0, v1, :cond_0

    .line 850
    const-string v0, "Plus de t\u00e2ches disponibles."

    invoke-static {p0, v0, v2}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    return-void

    .line 853
    :cond_0
    const-string v0, "\u23f3 Lancement de la t\u00e2che suivante..."

    const v1, -0x5f3b01

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    .line 854
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lorg/json/JSONObject;

    .line 855
    const-string v1, "id"

    const-string v3, ""

    invoke-virtual {v0, v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 856
    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "https://www."

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v5, ".com/"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v5, "target_username"

    .line 858
    invoke-virtual {v0, v5, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    const-string v6, "@"

    invoke-virtual {v5, v6, v3}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v3, "/"

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    .line 856
    const-string v4, "target_url"

    invoke-virtual {v0, v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    .line 859
    const-string v3, "label"

    const-string v4, "T\u00e2che"

    invoke-virtual {v0, v3, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    .line 860
    const-string v3, "worker_reward"

    const-wide/16 v4, 0x0

    invoke-virtual {v0, v3, v4, v5}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v3

    .line 861
    invoke-static {v3, v4}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v0

    new-array v2, v2, [Ljava/lang/Object;

    const/4 v3, 0x0

    aput-object v0, v2, v3

    const-string v0, "%.4f"

    invoke-static {v0, v2}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    .line 862
    invoke-direct {p0, v8}, Lcom/prsocial/app/MainActivity;->extractActionType(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    .line 864
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v2, Lcom/prsocial/app/MainActivity$7;

    move-object v4, v2

    move-object v5, p0

    move-object v6, v1

    invoke-direct/range {v4 .. v10}, Lcom/prsocial/app/MainActivity$7;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v1, v2}, Lcom/prsocial/app/ApiClient;->startTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private launchCurrentTask()V
    .locals 0

    .line 1157
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTaskInner()V

    return-void
.end method

.method private launchCurrentTaskInner()V
    .locals 10

    .line 1161
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 1162
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-lt v0, v1, :cond_1

    .line 1163
    const-string v0, "Plus de t\u00e2ches disponibles"

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onAutomationStopped(Ljava/lang/String;)V

    return-void

    .line 1166
    :cond_1
    const-string v0, "\u23f3 Lancement de la t\u00e2che suivante..."

    const v1, -0x5f3b01

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    .line 1167
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lorg/json/JSONObject;

    .line 1168
    const-string v1, "id"

    const-string v2, ""

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 1169
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "https://www.instagram.com/"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "target_username"

    .line 1171
    invoke-virtual {v0, v4, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v5, "@"

    invoke-virtual {v4, v5, v2}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, "/"

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    .line 1169
    const-string v3, "target_url"

    invoke-virtual {v0, v3, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    .line 1172
    const-string v2, "label"

    const-string v3, "T\u00e2che"

    invoke-virtual {v0, v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    .line 1173
    const-string v2, "worker_reward"

    const-wide/16 v3, 0x0

    invoke-virtual {v0, v2, v3, v4}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v2

    .line 1174
    invoke-static {v2, v3}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v0

    const/4 v2, 0x1

    new-array v2, v2, [Ljava/lang/Object;

    const/4 v3, 0x0

    aput-object v0, v2, v3

    const-string v0, "%.4f"

    invoke-static {v0, v2}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v9

    .line 1175
    invoke-direct {p0, v7}, Lcom/prsocial/app/MainActivity;->extractActionType(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    .line 1178
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v2, Lcom/prsocial/app/MainActivity$10;

    move-object v3, v2

    move-object v4, p0

    move-object v5, v1

    invoke-direct/range {v3 .. v9}, Lcom/prsocial/app/MainActivity$10;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v1, v2}, Lcom/prsocial/app/ApiClient;->startTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private launchCurrentTelegramTask()V
    .locals 6

    .line 1831
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 1832
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-lt v0, v1, :cond_1

    .line 1833
    const-string v0, "Plus de t\u00e2ches Telegram"

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onAutomationStopped(Ljava/lang/String;)V

    return-void

    .line 1836
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lorg/json/JSONObject;

    .line 1837
    const-string v1, "id"

    const-string v2, ""

    invoke-virtual {v0, v1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 1838
    const-string v3, "target_username"

    invoke-virtual {v0, v3, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 1839
    const-string v3, "worker_reward"

    const-wide/16 v4, 0x0

    invoke-virtual {v0, v3, v4, v5}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v3

    .line 1840
    invoke-static {v3, v4}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v0

    const/4 v3, 0x1

    new-array v3, v3, [Ljava/lang/Object;

    const/4 v4, 0x0

    aput-object v0, v3, v4

    const-string v0, "%.4f"

    invoke-static {v0, v3}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    .line 1842
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "\u23f3 D\u00e9marrage t\u00e2che Telegram "

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v4, "..."

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    const v4, -0xab5615

    invoke-direct {p0, v3, v4}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    .line 1844
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v4, Lcom/prsocial/app/MainActivity$15;

    invoke-direct {v4, p0, v1, v2, v0}, Lcom/prsocial/app/MainActivity$15;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v3, v1, v4}, Lcom/prsocial/app/ApiClient;->startTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V
    .locals 3

    .line 1572
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/prsocial/app/TaskWebViewActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 1573
    const-string v1, "token"

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1574
    const-string v1, "taskId"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1575
    const-string p1, "url"

    invoke-virtual {v0, p1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1576
    const-string p1, "label"

    invoke-virtual {v0, p1, p3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1577
    const-string p1, "actionType"

    invoke-virtual {v0, p1, p4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1578
    const-string p1, "gain"

    invoke-virtual {v0, p1, p5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1579
    const-string p1, "platform"

    invoke-virtual {v0, p1, p6}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 1580
    const-string p1, "taskAutoMode"

    const/4 p2, 0x1

    invoke-virtual {v0, p1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 1581
    const-string p1, "httpActionDone"

    invoke-virtual {v0, p1, p7}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 1582
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLauncher:Landroidx/activity/result/ActivityResultLauncher;

    invoke-virtual {p1, v0}, Landroidx/activity/result/ActivityResultLauncher;->launch(Ljava/lang/Object;)V

    return-void
.end method

.method private loadAndAutoStartManualTasks(Ljava/lang/String;Landroid/widget/ProgressBar;Landroid/widget/Button;)V
    .locals 1

    const/4 p3, 0x1

    .line 796
    iput-boolean p3, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    .line 797
    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    const/4 v0, 0x0

    .line 798
    invoke-virtual {p2, v0}, Landroid/widget/ProgressBar;->setVisibility(I)V

    .line 799
    invoke-direct {p0, p3}, Lcom/prsocial/app/MainActivity;->setRunningState(Z)V

    .line 800
    new-instance p3, Ljava/lang/StringBuilder;

    const-string v0, "\u23f3 R\u00e9cup\u00e9ration des t\u00e2ches "

    invoke-direct {p3, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, "..."

    invoke-virtual {p3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p3

    const/16 v0, -0x2900

    invoke-direct {p0, p3, v0}, Lcom/prsocial/app/MainActivity;->setStatusRow(Ljava/lang/String;I)V

    .line 802
    iget-object p3, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v0, Lcom/prsocial/app/MainActivity$6;

    invoke-direct {v0, p0, p2, p1}, Lcom/prsocial/app/MainActivity$6;-><init>(Lcom/prsocial/app/MainActivity;Landroid/widget/ProgressBar;Ljava/lang/String;)V

    invoke-static {p3, p1, v0}, Lcom/prsocial/app/ApiClient;->getAvailableTasks(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private loadAndAutoStartTasks()V
    .locals 2

    .line 1101
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    const-string v1, "instagram"

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 1102
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    return-void

    :cond_0
    const/4 v0, 0x0

    .line 1105
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    const/4 v1, 0x1

    .line 1106
    invoke-direct {p0, v1}, Lcom/prsocial/app/MainActivity;->setRunningState(Z)V

    .line 1107
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskListContainer:Landroid/widget/LinearLayout;

    invoke-virtual {v1}, Landroid/widget/LinearLayout;->removeAllViews()V

    .line 1108
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskProgress:Landroid/widget/ProgressBar;

    invoke-virtual {v1, v0}, Landroid/widget/ProgressBar;->setVisibility(I)V

    .line 1109
    const-string v0, "\u23f3 R\u00e9cup\u00e9ration des t\u00e2ches Instagram..."

    const/16 v1, -0x2900

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->setStatusRow(Ljava/lang/String;I)V

    .line 1111
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/MainActivity$9;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$9;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {v0, v1}, Lcom/prsocial/app/ApiClient;->getAvailableTasks(Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private loadAndAutoStartTelegramTasks()V
    .locals 4

    const/4 v0, 0x1

    .line 1780
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    .line 1781
    const-string v1, "telegram"

    iput-object v1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    .line 1782
    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->progressTelegram:Landroid/widget/ProgressBar;

    const/4 v3, 0x0

    invoke-virtual {v2, v3}, Landroid/widget/ProgressBar;->setVisibility(I)V

    .line 1783
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->setRunningState(Z)V

    .line 1784
    const-string v0, "\u23f3 R\u00e9cup\u00e9ration des t\u00e2ches Telegram..."

    const/16 v2, -0x2900

    invoke-direct {p0, v0, v2}, Lcom/prsocial/app/MainActivity;->setStatusRow(Ljava/lang/String;I)V

    .line 1786
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v2, Lcom/prsocial/app/MainActivity$14;

    invoke-direct {v2, p0}, Lcom/prsocial/app/MainActivity$14;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {v0, v1, v2}, Lcom/prsocial/app/ApiClient;->getAvailableTasks(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private loadDashboard()V
    .locals 2

    .line 541
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/MainActivity$3;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$3;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {v0, v1}, Lcom/prsocial/app/ApiClient;->validateToken(Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private loadMe()V
    .locals 2

    .line 494
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/MainActivity$2;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$2;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {v0, v1}, Lcom/prsocial/app/ApiClient;->getMe(Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void
.end method

.method private logout()V
    .locals 2

    .line 2164
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v0}, Lcom/prsocial/app/SessionManager;->clear()V

    .line 2166
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v0

    const/4 v1, 0x0

    .line 2167
    invoke-virtual {v0, v1}, Landroid/webkit/CookieManager;->removeAllCookies(Landroid/webkit/ValueCallback;)V

    .line 2168
    invoke-virtual {v0}, Landroid/webkit/CookieManager;->flush()V

    .line 2169
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/prsocial/app/LoginActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->startActivity(Landroid/content/Intent;)V

    .line 2170
    invoke-virtual {p0}, Lcom/prsocial/app/MainActivity;->finish()V

    return-void
.end method

.method private maskEmail(Ljava/lang/String;)Ljava/lang/String;
    .locals 7

    if-eqz p1, :cond_2

    .line 530
    const-string v0, "@"

    invoke-virtual {p1, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_0

    goto :goto_1

    :cond_0
    const/4 v1, 0x2

    .line 531
    invoke-virtual {p1, v0, v1}, Ljava/lang/String;->split(Ljava/lang/String;I)[Ljava/lang/String;

    move-result-object p1

    const/4 v2, 0x0

    .line 532
    aget-object v3, p1, v2

    const/4 v4, 0x1

    .line 533
    aget-object p1, p1, v4

    .line 534
    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v5

    const-string v6, "***"

    if-gt v5, v1, :cond_1

    goto :goto_0

    .line 535
    :cond_1
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v3, v2}, Ljava/lang/String;->charAt(I)C

    move-result v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v2

    sub-int/2addr v2, v4

    invoke-virtual {v3, v2}, Ljava/lang/String;->charAt(I)C

    move-result v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    .line 536
    :goto_0
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v1, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    return-object p1

    .line 530
    :cond_2
    :goto_1
    const-string p1, "***@***.***"

    return-object p1
.end method

.method private onAutomationStopped(Ljava/lang/String;)V
    .locals 3

    .line 784
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    .line 785
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v0, :cond_0

    .line 786
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->onMultiPlatformDone(Ljava/lang/String;)V

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    .line 788
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->setRunningState(Z)V

    .line 789
    const-string v1, "STOP"

    const-string v2, ""

    invoke-direct {p0, v1, v2, v0, p1}, Lcom/prsocial/app/MainActivity;->appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    :goto_0
    return-void
.end method

.method private onHttpActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 9

    move-object v8, p0

    move-object v0, p1

    move-object v2, p3

    move-object v4, p5

    .line 1421
    iget-boolean v1, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->success:Z

    const-string v3, "PRSocial_Main"

    if-eqz v1, :cond_1

    .line 1422
    iget-object v1, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    if-eqz v1, :cond_0

    iget-object v1, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_0

    iget-object v0, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    goto :goto_0

    :cond_0
    const-string v0, "OK"

    .line 1423
    :goto_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    .line 1424
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, " \u2192 capture"

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const/4 v1, 0x1

    invoke-direct {p0, p5, p3, v1, v0}, Lcom/prsocial/app/MainActivity;->appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    .line 1425
    const-string v0, "HTTP action success, launching browser for screenshot"

    invoke-static {v3, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1426
    const-string v0, "\ud83d\udcf8 Capture en cours..."

    const v1, -0x9b4a0a

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    const/4 v7, 0x1

    move-object v0, p0

    move-object v1, p2

    move-object v2, p3

    move-object v3, p4

    move-object v4, p5

    move-object v5, p6

    move-object/from16 v6, p7

    .line 1427
    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity;->launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V

    goto :goto_1

    .line 1429
    :cond_1
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v5, "HTTP action failed state="

    invoke-direct {v1, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v5, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v5, " msg="

    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v5, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v3, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1430
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    .line 1431
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v3, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v3, " ["

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v3, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v3, "]"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const/4 v3, 0x0

    invoke-direct {p0, p5, p3, v3, v1}, Lcom/prsocial/app/MainActivity;->appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    move-object v1, p2

    move-object/from16 v2, p7

    .line 1432
    invoke-direct {p0, p2, p1, v2}, Lcom/prsocial/app/MainActivity;->handleHttpActionFailure(Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;)V

    :goto_1
    return-void
.end method

.method private onMultiPlatformDone(Ljava/lang/String;)V
    .locals 3

    .line 2421
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 2422
    :cond_0
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\u2714 "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " termin\u00e9: "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const v0, -0xaf2267

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2423
    iget p1, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    add-int/lit8 p1, p1, 0x1

    iput p1, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    const/4 p1, 0x0

    .line 2424
    iput-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    .line 2425
    iput-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    .line 2426
    new-instance p1, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v0

    invoke-direct {p1, v0}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda67;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda67;-><init>(Lcom/prsocial/app/MainActivity;)V

    const-wide/16 v1, 0x5dc

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private openManualTaskWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 8

    .line 1063
    invoke-direct {p0, p4, p6}, Lcom/prsocial/app/MainActivity;->isSkippableAction(Ljava/lang/String;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 1064
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance v1, Lcom/prsocial/app/MainActivity$8;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$8;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {v0, p1, v1}, Lcom/prsocial/app/ApiClient;->cancelTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void

    .line 1075
    :cond_0
    const-string v0, "threads"

    invoke-virtual {v0, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    const/4 v1, 0x0

    const/4 v3, 0x1

    if-nez v0, :cond_2

    const-string v0, "youtube"

    .line 1076
    invoke-virtual {v0, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_2

    const-string v0, "instagram"

    .line 1077
    invoke-virtual {v0, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v0, 0x0

    goto :goto_1

    :cond_2
    :goto_0
    const/4 v0, 0x1

    .line 1078
    :goto_1
    const-string v5, "tiktok"

    invoke-virtual {v5, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v5

    .line 1079
    const-string v7, "LIKE"

    invoke-virtual {v7, p4}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v7

    if-nez v7, :cond_3

    const-string v7, "FOLLOW"

    .line 1080
    invoke-virtual {v7, p4}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v7

    if-eqz v7, :cond_4

    :cond_3
    const/4 v1, 0x1

    :cond_4
    if-eqz v0, :cond_5

    if-eqz v1, :cond_5

    .line 1083
    invoke-direct/range {p0 .. p6}, Lcom/prsocial/app/MainActivity;->performHttpActionThenLaunch(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_2

    :cond_5
    if-eqz v5, :cond_6

    if-eqz v1, :cond_6

    const/4 v7, 0x0

    move-object v0, p0

    move-object v1, p1

    move-object v2, p2

    move-object v3, p3

    move-object v4, p4

    move-object v5, p5

    move-object v6, p6

    .line 1085
    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity;->launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V

    goto :goto_2

    .line 1086
    :cond_6
    const-string v0, "telegram"

    invoke-virtual {v0, p6}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_7

    const/4 v7, 0x1

    move-object v0, p0

    move-object v1, p1

    move-object v2, p2

    move-object v3, p3

    move-object v4, p4

    move-object v5, p5

    move-object v6, p6

    .line 1089
    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity;->launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V

    goto :goto_2

    :cond_7
    const/4 v7, 0x0

    move-object v0, p0

    move-object v1, p1

    move-object v2, p2

    move-object v3, p3

    move-object v4, p4

    move-object v5, p5

    move-object v6, p6

    .line 1091
    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity;->launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V

    :goto_2
    return-void
.end method

.method private openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V
    .locals 2

    .line 486
    new-instance v0, Landroid/content/Intent;

    const-class v1, Lcom/prsocial/app/WebViewActivity;

    invoke-direct {v0, p0, v1}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 487
    const-string v1, "url"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 488
    const-string p1, "mode"

    invoke-virtual {v0, p1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 489
    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->startActivity(Landroid/content/Intent;)V

    return-void
.end method

.method private openTaskWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 9

    .line 1376
    const-string v0, "instagram"

    invoke-direct {p0, p4, v0}, Lcom/prsocial/app/MainActivity;->isSkippableAction(Ljava/lang/String;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 1377
    iget-object p2, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance p3, Lcom/prsocial/app/MainActivity$11;

    invoke-direct {p3, p0}, Lcom/prsocial/app/MainActivity$11;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-static {p2, p1, p3}, Lcom/prsocial/app/ApiClient;->cancelTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    return-void

    .line 1387
    :cond_0
    const-string v0, "LIKE"

    invoke-virtual {v0, p4}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_2

    const-string v0, "FOLLOW"

    .line 1388
    invoke-virtual {v0, p4}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    goto :goto_0

    .line 1392
    :cond_1
    const-string v7, "instagram"

    const/4 v8, 0x0

    move-object v1, p0

    move-object v2, p1

    move-object v3, p2

    move-object v4, p3

    move-object v5, p4

    move-object v6, p5

    invoke-direct/range {v1 .. v8}, Lcom/prsocial/app/MainActivity;->launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V

    goto :goto_1

    .line 1390
    :cond_2
    :goto_0
    const-string v6, "instagram"

    move-object v0, p0

    move-object v1, p1

    move-object v2, p2

    move-object v3, p3

    move-object v4, p4

    move-object v5, p5

    invoke-direct/range {v0 .. v6}, Lcom/prsocial/app/MainActivity;->performHttpActionThenLaunch(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    :goto_1
    return-void
.end method

.method private parseWaitSeconds(Ljava/lang/String;)I
    .locals 6

    const/4 v0, 0x0

    if-nez p1, :cond_0

    return v0

    .line 1321
    :cond_0
    invoke-virtual {p1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object p1

    .line 1322
    const-string v1, "wait"

    invoke-virtual {p1, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_1

    return v0

    .line 1325
    :cond_1
    const-string v1, "(\\d+)\\s*s\\b"

    invoke-static {v1}, Ljava/util/regex/Pattern;->compile(Ljava/lang/String;)Ljava/util/regex/Pattern;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/util/regex/Pattern;->matcher(Ljava/lang/CharSequence;)Ljava/util/regex/Matcher;

    move-result-object v1

    .line 1326
    invoke-virtual {v1}, Ljava/util/regex/Matcher;->find()Z

    move-result v2

    const/4 v3, 0x1

    if-eqz v2, :cond_2

    .line 1327
    invoke-virtual {v1, v3}, Ljava/util/regex/Matcher;->group(I)Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result p1

    return p1

    .line 1331
    :cond_2
    const-string v1, "(\\d+)\\s*(?:second|sec)"

    invoke-static {v1}, Ljava/util/regex/Pattern;->compile(Ljava/lang/String;)Ljava/util/regex/Pattern;

    move-result-object v1

    invoke-virtual {v1, p1}, Ljava/util/regex/Pattern;->matcher(Ljava/lang/CharSequence;)Ljava/util/regex/Matcher;

    move-result-object v1

    .line 1332
    invoke-virtual {v1}, Ljava/util/regex/Matcher;->find()Z

    move-result v2

    if-eqz v2, :cond_3

    .line 1333
    invoke-virtual {v1, v3}, Ljava/util/regex/Matcher;->group(I)Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result p1

    return p1

    .line 1337
    :cond_3
    const-string v1, " "

    invoke-virtual {p1, v1}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p1

    const/4 v1, 0x0

    .line 1338
    :goto_0
    array-length v2, p1

    sub-int/2addr v2, v3

    if-ge v1, v2, :cond_6

    .line 1339
    aget-object v2, p1, v1

    const-string v4, "[^0-9]"

    const-string v5, ""

    invoke-virtual {v2, v4, v5}, Ljava/lang/String;->replaceAll(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 1340
    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v4

    if-nez v4, :cond_5

    .line 1342
    :try_start_0
    invoke-static {v2}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v2

    add-int/lit8 v4, v1, 0x1

    .line 1343
    aget-object v4, p1, v4

    invoke-virtual {v4}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object v4

    .line 1344
    const-string v5, "s"

    invoke-virtual {v4, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v5

    if-nez v5, :cond_4

    const-string v5, "second"

    invoke-virtual {v4, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v5

    if-nez v5, :cond_4

    const-string v5, "sec"

    invoke-virtual {v4, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v4
    :try_end_0
    .catch Ljava/lang/NumberFormatException; {:try_start_0 .. :try_end_0} :catch_0

    if-eqz v4, :cond_5

    :cond_4
    return v2

    :catch_0
    :cond_5
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    :cond_6
    return v0
.end method

.method private performHttpActionThenLaunch(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 13

    move-object v8, p0

    move-object v9, p2

    move-object/from16 v10, p4

    move-object/from16 v11, p6

    .line 1403
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "performHttpActionThenLaunch platform="

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " action="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " url="

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "PRSocial_Main"

    invoke-static {v1, v0}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I

    .line 1405
    new-instance v12, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda24;

    move-object v0, v12

    move-object v1, p0

    move-object v2, p1

    move-object v3, p2

    move-object/from16 v4, p3

    move-object/from16 v5, p4

    move-object/from16 v6, p5

    move-object/from16 v7, p6

    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda24;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1407
    const-string v0, "threads"

    invoke-virtual {v0, v11}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    .line 1408
    new-instance v12, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda25;

    move-object v0, v12

    move-object v1, p0

    move-object v2, p1

    move-object v3, p2

    move-object/from16 v4, p3

    move-object/from16 v5, p4

    move-object/from16 v6, p5

    move-object/from16 v7, p6

    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda25;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p0, v10, p2, v12}, Lcom/prsocial/app/ThreadsActionClient;->performAction(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ThreadsActionClient$ResultCallback;)V

    goto :goto_0

    .line 1410
    :cond_0
    const-string v0, "youtube"

    invoke-virtual {v0, v11}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    .line 1411
    new-instance v12, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda26;

    move-object v0, v12

    move-object v1, p0

    move-object v2, p1

    move-object v3, p2

    move-object/from16 v4, p3

    move-object/from16 v5, p4

    move-object/from16 v6, p5

    move-object/from16 v7, p6

    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda26;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p0, v10, p2, v12}, Lcom/prsocial/app/YouTubeActionClient;->performAction(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/YouTubeActionClient$ResultCallback;)V

    goto :goto_0

    .line 1414
    :cond_1
    invoke-static {p0, v10, p2, v12}, Lcom/prsocial/app/InstagramActionClient;->performAction(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ResultCallback;)V

    :goto_0
    return-void
.end method

.method private removeCurrentManualTaskAndLoadNext()V
    .locals 4

    .line 1001
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 1002
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_1

    .line 1003
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->remove(I)Ljava/lang/Object;

    .line 1006
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_3

    .line 1007
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 1008
    iget-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v1, :cond_2

    .line 1009
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "\ud83d\udeab "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, ": "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const v2, -0x9495

    invoke-direct {p0, v1, v2}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 1010
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onMultiPlatformDone(Ljava/lang/String;)V

    goto :goto_0

    .line 1012
    :cond_2
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onAutomationStopped(Ljava/lang/String;)V

    .line 1013
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    :goto_0
    return-void

    .line 1017
    :cond_3
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda16;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda16;-><init>(Lcom/prsocial/app/MainActivity;)V

    const-wide/16 v2, 0x1388

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private removeCurrentTaskAndLoadNext()V
    .locals 4

    .line 1736
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 1737
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_1

    .line 1738
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->remove(I)Ljava/lang/Object;

    .line 1740
    :cond_1
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda55;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda55;-><init>(Lcom/prsocial/app/MainActivity;)V

    const-wide/16 v2, 0x1388

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private removeTelegramTaskAndNext()V
    .locals 4

    .line 1999
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 2000
    :cond_0
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->telegramNextScheduled:Z

    if-eqz v0, :cond_1

    return-void

    :cond_1
    const/4 v0, 0x1

    .line 2001
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->telegramNextScheduled:Z

    .line 2002
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_2

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->remove(I)Ljava/lang/Object;

    .line 2003
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    const-string v1, "telegram"

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_3

    const/4 v0, 0x0

    .line 2004
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->telegramNextScheduled:Z

    .line 2005
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onAutomationStopped(Ljava/lang/String;)V

    return-void

    .line 2008
    :cond_3
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda12;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda12;-><init>(Lcom/prsocial/app/MainActivity;)V

    const-wide/16 v2, 0x1388

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void
.end method

.method private resetSocialStatus(Landroid/widget/TextView;Ljava/lang/String;)V
    .locals 2

    .line 691
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\u26a0 Aucun compte "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p2, " li\u00e9"

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 692
    sget p2, Lcom/prsocial/app/R$color;->warning_yellow:I

    invoke-static {p0, p2}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setTextColor(I)V

    return-void
.end method

.method private resumeAutomation()V
    .locals 2

    .line 2021
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 2022
    :cond_0
    const-string v0, "\ud83d\udd04 Reprise de l\'automation..."

    const v1, -0x5f3b01

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendActiveLog(Ljava/lang/String;I)V

    .line 2023
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_2

    .line 2024
    const-string v0, "telegram"

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTelegramTask()V

    goto :goto_0

    .line 2025
    :cond_1
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTask()V

    goto :goto_0

    .line 2027
    :cond_2
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTask()V

    :goto_0
    return-void
.end method

.method private runNextMultiPlatform()V
    .locals 6

    .line 2356
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 2357
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    const/4 v2, 0x0

    const/16 v3, -0x55cd

    const/4 v4, 0x1

    if-lt v0, v1, :cond_5

    .line 2360
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :cond_1
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_4

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2361
    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v5, v1}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_1

    .line 2370
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v0

    :cond_2
    invoke-interface {v0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-eqz v1, :cond_3

    invoke-interface {v0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    .line 2371
    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    invoke-interface {v5, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/util/List;

    if-eqz v1, :cond_2

    .line 2372
    invoke-interface {v1}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_2

    .line 2381
    const-string v0, "\ud83d\udd04 Cycle termin\u00e9, red\u00e9marrage..."

    const/16 v1, -0x2900

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2382
    iput v2, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    .line 2383
    new-instance v0, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v1

    invoke-direct {v0, v1}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda33;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda33;-><init>(Lcom/prsocial/app/MainActivity;)V

    const-wide/16 v2, 0xbb8

    invoke-virtual {v0, v1, v2, v3}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    return-void

    .line 2375
    :cond_3
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopMultiLaunch()V

    .line 2376
    const-string v0, "\u26a0\ufe0f Aucune t\u00e2che disponible sur tous les r\u00e9seaux. Arr\u00eat."

    invoke-direct {p0, v0, v3}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2377
    const-string v0, "\u26a0\ufe0f Plus aucune t\u00e2che disponible sur tous les r\u00e9seaux"

    invoke-static {p0, v0, v4}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    return-void

    .line 2364
    :cond_4
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopMultiLaunch()V

    .line 2365
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->showAllPlatformsBlockedBanner()V

    return-void

    .line 2389
    :cond_5
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    iget v1, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    invoke-interface {v0, v1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    .line 2390
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    invoke-interface {v1, v0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/List;

    if-eqz v0, :cond_9

    .line 2391
    invoke-interface {v0}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_6

    goto/16 :goto_1

    .line 2398
    :cond_6
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v1, v3}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_7

    .line 2399
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 2400
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "\ud83d\udeab "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, " bloqu\u00e9: "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const v1, -0x9495

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2401
    iget v0, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    add-int/2addr v0, v4

    iput v0, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    .line 2402
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runNextMultiPlatform()V

    return-void

    .line 2405
    :cond_7
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "\u25b6 Lancement "

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v3, " ("

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 2406
    invoke-interface {v0}, Ljava/util/List;->size()I

    move-result v3

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v3, " t\u00e2ches restantes)"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const v3, -0x5f3b01

    .line 2405
    invoke-direct {p0, v1, v3}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2407
    iput-boolean v4, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    .line 2408
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    iput-object v1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    .line 2409
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    .line 2410
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiTaskIndexes:Ljava/util/Map;

    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v2

    invoke-static {v0, v1, v2}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticApiModelOutline0;->m(Ljava/util/Map;Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/Integer;

    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    iput v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    .line 2411
    iput-boolean v4, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    .line 2412
    const-string v0, "telegram"

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_8

    .line 2413
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTelegramTask()V

    goto :goto_0

    .line 2415
    :cond_8
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTask()V

    :goto_0
    return-void

    .line 2392
    :cond_9
    :goto_1
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\u23ed "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, " : plus de t\u00e2ches, passage suivant"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0, v3}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2393
    iget v0, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    add-int/2addr v0, v4

    iput v0, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    .line 2394
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runNextMultiPlatform()V

    return-void
.end method

.method private runSubscriptionCheck()V
    .locals 0

    return-void
.end method

.method private scheduleSubscriptionCheck()V
    .locals 0

    return-void
.end method

.method private setButtonLinkedState(Landroid/widget/Button;Z)V
    .locals 0

    if-nez p1, :cond_0

    return-void

    :cond_0
    if-eqz p2, :cond_1

    const/high16 p2, 0x3f800000    # 1.0f

    goto :goto_0

    :cond_1
    const p2, 0x3ecccccd    # 0.4f

    .line 687
    :goto_0
    invoke-virtual {p1, p2}, Landroid/widget/Button;->setAlpha(F)V

    return-void
.end method

.method private setMultiOverlay(Z)V
    .locals 1

    .line 2465
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda64;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda64;-><init>(Lcom/prsocial/app/MainActivity;Z)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private setRunningState(Z)V
    .locals 1

    .line 754
    iput-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    .line 755
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda48;

    invoke-direct {v0, p0, p1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda48;-><init>(Lcom/prsocial/app/MainActivity;Z)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private setStatusRow(Ljava/lang/String;I)V
    .locals 1

    .line 1587
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda44;

    invoke-direct {v0, p0, p1, p2}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda44;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;I)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private setupSubscriptionUI()V
    .locals 6

    .line 2046
    sget v0, Lcom/prsocial/app/R$id;->btn_subscription_toggle:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/LinearLayout;

    .line 2047
    sget v1, Lcom/prsocial/app/R$id;->layout_subscription_details:I

    invoke-virtual {p0, v1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v1

    check-cast v1, Landroid/widget/LinearLayout;

    .line 2048
    sget v2, Lcom/prsocial/app/R$id;->tv_subscription_arrow:I

    invoke-virtual {p0, v2}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v2

    check-cast v2, Landroid/widget/TextView;

    .line 2049
    sget v3, Lcom/prsocial/app/R$id;->tv_sub_countdown:I

    invoke-virtual {p0, v3}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v3

    check-cast v3, Landroid/widget/TextView;

    .line 2050
    sget v4, Lcom/prsocial/app/R$id;->tv_sub_status:I

    invoke-virtual {p0, v4}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v4

    check-cast v4, Landroid/widget/TextView;

    if-eqz v0, :cond_0

    if-eqz v1, :cond_0

    if-eqz v2, :cond_0

    .line 2053
    new-instance v4, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda27;

    invoke-direct {v4, p0, v1, v2}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda27;-><init>(Lcom/prsocial/app/MainActivity;Landroid/widget/LinearLayout;Landroid/widget/TextView;)V

    invoke-virtual {v0, v4}, Landroid/widget/LinearLayout;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 2069
    :cond_0
    sget v0, Lcom/prsocial/app/R$id;->btn_sub_support:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    .line 2070
    sget v1, Lcom/prsocial/app/R$id;->btn_sub_renew:I

    invoke-virtual {p0, v1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v1

    check-cast v1, Landroid/widget/Button;

    if-eqz v0, :cond_1

    .line 2072
    new-instance v2, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda28;

    invoke-direct {v2, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda28;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v2}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    :cond_1
    if-eqz v1, :cond_2

    .line 2076
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda29;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda29;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v1, v0}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 2082
    :cond_2
    sget v0, Lcom/prsocial/app/R$id;->btn_sub_copy_id:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/Button;

    if-eqz v0, :cond_3

    .line 2083
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda30;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda30;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 2092
    :cond_3
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->subMgr:Lcom/prsocial/app/SubscriptionManager;

    invoke-virtual {v0}, Lcom/prsocial/app/SubscriptionManager;->getRemainingMillis()J

    move-result-wide v0

    if-eqz v3, :cond_4

    const-wide/16 v4, 0x0

    cmp-long v2, v0, v4

    if-lez v2, :cond_4

    .line 2093
    invoke-direct {p0, v3, v0, v1}, Lcom/prsocial/app/MainActivity;->startSubCountdown(Landroid/widget/TextView;J)V

    .line 2096
    :cond_4
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->updateSubscriptionDetails()V

    return-void
.end method

.method private showAllPlatformsBlockedBanner()V
    .locals 1

    .line 2445
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda19;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda19;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method private showTaskError(Ljava/lang/String;)V
    .locals 2

    .line 1751
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 1752
    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 1753
    sget p1, Lcom/prsocial/app/R$color;->warning_yellow:I

    invoke-static {p0, p1}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setTextColor(I)V

    const/16 p1, 0x20

    const/16 v1, 0x18

    .line 1754
    invoke-virtual {v0, p1, v1, p1, v1}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 1755
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskListContainer:Landroid/widget/LinearLayout;

    invoke-virtual {p1, v0}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    return-void
.end method

.method private startMultiLaunch()V
    .locals 6

    .line 2265
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->clear()V

    const/4 v0, 0x0

    const/4 v1, 0x0

    .line 2266
    :goto_0
    sget-object v2, Lcom/prsocial/app/MainActivity;->MULTI_PLATFORMS:[Ljava/lang/String;

    array-length v3, v2

    if-ge v1, v3, :cond_2

    .line 2267
    aget-object v2, v2, v1

    .line 2269
    const-string v3, "telegram"

    invoke-virtual {v3, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_0

    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->tgSm:Lcom/prsocial/app/TelegramSessionManager;

    invoke-virtual {v3}, Lcom/prsocial/app/TelegramSessionManager;->isConnected()Z

    move-result v3

    goto :goto_1

    :cond_0
    invoke-direct {p0, v2}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v3

    .line 2270
    :goto_1
    sget-object v4, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->multiEnabled:Ljava/util/Map;

    invoke-interface {v5, v2}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/Boolean;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_1

    if-eqz v3, :cond_1

    .line 2271
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v3, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 2274
    :cond_2
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_3

    .line 2275
    const-string v1, "\u26a0 Activez au moins un r\u00e9seau li\u00e9 (ON)"

    invoke-static {p0, v1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    return-void

    .line 2278
    :cond_3
    iget-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v1, :cond_4

    .line 2279
    const-string v1, "\u26a0 Un lancement individuel est d\u00e9j\u00e0 en cours"

    invoke-static {p0, v1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    return-void

    :cond_4
    const/4 v1, 0x1

    .line 2282
    iput-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    .line 2283
    iput v0, p0, Lcom/prsocial/app/MainActivity;->multiQueueIndex:I

    .line 2284
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    .line 2285
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiTaskIndexes:Ljava/util/Map;

    invoke-interface {v0}, Ljava/util/Map;->clear()V

    .line 2288
    invoke-direct {p0, v1}, Lcom/prsocial/app/MainActivity;->setMultiOverlay(Z)V

    .line 2289
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnMultiLaunch:Landroid/widget/Button;

    if-eqz v0, :cond_5

    .line 2290
    const-string v1, "\u23f9 Stop"

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    .line 2291
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnMultiLaunch:Landroid/widget/Button;

    const v1, -0x33cccd

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setBackgroundColor(I)V

    .line 2293
    :cond_5
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\ud83d\ude80 Lancement multi-r\u00e9seau : "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-virtual {v1}, Ljava/lang/Object;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const/16 v1, -0x2900

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 2295
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->fetchAllMultiTasks()V

    return-void
.end method

.method private startSubCountdown(Landroid/widget/TextView;J)V
    .locals 8

    .line 2122
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->subCountdown:Landroid/os/CountDownTimer;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Landroid/os/CountDownTimer;->cancel()V

    .line 2123
    :cond_0
    new-instance v0, Lcom/prsocial/app/MainActivity$18;

    const-wide/16 v5, 0x3e8

    move-object v1, v0

    move-object v2, p0

    move-wide v3, p2

    move-object v7, p1

    invoke-direct/range {v1 .. v7}, Lcom/prsocial/app/MainActivity$18;-><init>(Lcom/prsocial/app/MainActivity;JJLandroid/widget/TextView;)V

    .line 2131
    invoke-virtual {v0}, Lcom/prsocial/app/MainActivity$18;->start()Landroid/os/CountDownTimer;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->subCountdown:Landroid/os/CountDownTimer;

    return-void
.end method

.method private stopAutomation()V
    .locals 4

    .line 774
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->clear()V

    const/4 v0, 0x0

    .line 775
    iput v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    .line 776
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->telegramNextScheduled:Z

    .line 777
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    .line 778
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->setRunningState(Z)V

    .line 779
    const-string v1, ""

    const-string v2, "Arr\u00eat manuel"

    const-string v3, "STOP"

    invoke-direct {p0, v3, v1, v0, v2}, Lcom/prsocial/app/MainActivity;->appendLog(Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    return-void
.end method

.method private stopMultiLaunch()V
    .locals 2

    const/4 v0, 0x0

    .line 2430
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    .line 2431
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    .line 2432
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    .line 2433
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->clear()V

    .line 2434
    iput v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    .line 2435
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->setMultiOverlay(Z)V

    .line 2436
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnMultiLaunch:Landroid/widget/Button;

    if-eqz v0, :cond_0

    .line 2437
    const-string v1, "\ud83d\ude80 Lancer tout"

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    .line 2438
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnMultiLaunch:Landroid/widget/Button;

    const v1, -0xdd55ab

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setBackgroundColor(I)V

    .line 2440
    :cond_0
    const-string v0, "\u23f9 Multi-lancement arr\u00eat\u00e9"

    const v1, -0x9495

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    return-void
.end method

.method private updateDashboardUI(Lorg/json/JSONObject;)V
    .locals 13

    .line 557
    const-string v0, "balance"

    const-wide/16 v1, 0x0

    invoke-virtual {p1, v0, v1, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v4

    .line 558
    const-string v0, "totalEarned"

    invoke-virtual {p1, v0, v1, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v6

    .line 559
    const-string v0, "streak"

    const/4 v9, 0x0

    invoke-virtual {p1, v0, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v8

    .line 561
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvBalance:Landroid/widget/TextView;

    const-string v3, "$"

    invoke-direct {p0, v0, v4, v5, v3}, Lcom/prsocial/app/MainActivity;->animateCountUp(Landroid/widget/TextView;DLjava/lang/String;)V

    .line 562
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvEarned:Landroid/widget/TextView;

    invoke-direct {p0, v0, v6, v7, v3}, Lcom/prsocial/app/MainActivity;->animateCountUp(Landroid/widget/TextView;DLjava/lang/String;)V

    .line 563
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvStreak:Landroid/widget/TextView;

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v3, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v10, " jour(s) \ud83d\udd25"

    invoke-virtual {v3, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 564
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual/range {v3 .. v8}, Lcom/prsocial/app/SessionManager;->saveDashboard(DDI)V

    .line 566
    const-string v0, "statusCounts"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 568
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->tvApproved:Landroid/widget/TextView;

    const-string v4, "approved"

    invoke-virtual {v0, v4, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 569
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->tvPending:Landroid/widget/TextView;

    const-string v4, "pending_review"

    invoke-virtual {v0, v4, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 570
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->tvAbandoned:Landroid/widget/TextView;

    const-string v4, "abandoned"

    invoke-virtual {v0, v4, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v0

    invoke-static {v0}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v3, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 573
    :cond_0
    const-string v0, "periodStats"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p1

    if-eqz p1, :cond_3

    .line 575
    const-string v0, "today"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    .line 576
    const-string v3, "week"

    invoke-virtual {p1, v3}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v3

    .line 577
    const-string v4, "month"

    invoke-virtual {p1, v4}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p1

    const/4 v4, 0x1

    .line 578
    const-string v5, "earned"

    const-string v6, "%.4f $"

    const-string v7, " t\u00e2ches"

    const-string v8, "tasks"

    if-eqz v0, :cond_1

    .line 579
    iget-object v10, p0, Lcom/prsocial/app/MainActivity;->tvTodayTasks:Landroid/widget/TextView;

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-direct {v11}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v0, v8, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v11, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-virtual {v10, v11}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 580
    iget-object v10, p0, Lcom/prsocial/app/MainActivity;->tvTodayEarned:Landroid/widget/TextView;

    invoke-virtual {v0, v5, v1, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v11

    invoke-static {v11, v12}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v0

    new-array v11, v4, [Ljava/lang/Object;

    aput-object v0, v11, v9

    invoke-static {v6, v11}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v10, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_1
    if-eqz v3, :cond_2

    .line 583
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvWeekTasks:Landroid/widget/TextView;

    new-instance v10, Ljava/lang/StringBuilder;

    invoke-direct {v10}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v3, v8, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v11

    invoke-virtual {v10, v11}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v10, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-virtual {v0, v10}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 584
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvWeekEarned:Landroid/widget/TextView;

    invoke-virtual {v3, v5, v1, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v10

    invoke-static {v10, v11}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v3

    new-array v10, v4, [Ljava/lang/Object;

    aput-object v3, v10, v9

    invoke-static {v6, v10}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_2
    if-eqz p1, :cond_3

    .line 587
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvMonthTasks:Landroid/widget/TextView;

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {p1, v8, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v8

    invoke-virtual {v3, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v3, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 588
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvMonthEarned:Landroid/widget/TextView;

    invoke-virtual {p1, v5, v1, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;D)D

    move-result-wide v1

    invoke-static {v1, v2}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object p1

    new-array v1, v4, [Ljava/lang/Object;

    aput-object p1, v1, v9

    invoke-static {v6, v1}, Ljava/lang/String;->format(Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_3
    return-void
.end method

.method private updateEmailDisplay()V
    .locals 2

    .line 519
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvProfileEmail:Landroid/widget/TextView;

    if-nez v0, :cond_0

    return-void

    .line 520
    :cond_0
    iget-boolean v1, p0, Lcom/prsocial/app/MainActivity;->emailVisible:Z

    if-eqz v1, :cond_1

    .line 521
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->fullEmail:Ljava/lang/String;

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 522
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnToggleEmail:Landroid/widget/TextView;

    if-eqz v0, :cond_2

    const-string v1, "\ud83d\udc41"

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    goto :goto_0

    .line 524
    :cond_1
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->fullEmail:Ljava/lang/String;

    invoke-direct {p0, v1}, Lcom/prsocial/app/MainActivity;->maskEmail(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 525
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnToggleEmail:Landroid/widget/TextView;

    if-eqz v0, :cond_2

    const-string v1, "\ud83d\udeab"

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_2
    :goto_0
    return-void
.end method

.method private updateMultiToggleBtn(Landroid/widget/Button;Z)V
    .locals 1

    if-eqz p2, :cond_0

    .line 2255
    const-string v0, "ON"

    goto :goto_0

    :cond_0
    const-string v0, "OFF"

    :goto_0
    invoke-virtual {p1, v0}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    if-eqz p2, :cond_1

    const p2, -0xdd55ab

    goto :goto_1

    :cond_1
    const p2, -0xbbbb9a

    .line 2256
    :goto_1
    invoke-virtual {p1, p2}, Landroid/widget/Button;->setBackgroundColor(I)V

    return-void
.end method

.method private updateSocialStatus(Landroid/widget/TextView;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2

    .line 696
    invoke-virtual {p2}, Ljava/lang/String;->hashCode()I

    invoke-virtual {p2}, Ljava/lang/String;->hashCode()I

    move-result v0

    const/4 v1, -0x1

    sparse-switch v0, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v0, "approved"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/4 v1, 0x2

    goto :goto_0

    :sswitch_1
    const-string v0, "disabled"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_0

    :cond_1
    const/4 v1, 0x1

    goto :goto_0

    :sswitch_2
    const-string v0, "suspended"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_0

    :cond_2
    const/4 v1, 0x0

    :goto_0
    packed-switch v1, :pswitch_data_0

    .line 710
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\u23f3 @"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p3, " \u00b7 "

    invoke-virtual {v0, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 711
    sget p2, Lcom/prsocial/app/R$color;->warning_yellow:I

    invoke-static {p0, p2}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setTextColor(I)V

    goto :goto_1

    .line 698
    :pswitch_0
    new-instance p2, Ljava/lang/StringBuilder;

    const-string v0, "\u2714 @"

    invoke-direct {p2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p3, " \u00b7 Connect\u00e9"

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 699
    sget p2, Lcom/prsocial/app/R$color;->success_green:I

    invoke-static {p0, p2}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setTextColor(I)V

    goto :goto_1

    .line 706
    :pswitch_1
    new-instance p2, Ljava/lang/StringBuilder;

    const-string v0, "\u26d4 @"

    invoke-direct {p2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p3, " \u00b7 D\u00e9sactiv\u00e9"

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 707
    sget p2, Lcom/prsocial/app/R$color;->error_red:I

    invoke-static {p0, p2}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setTextColor(I)V

    goto :goto_1

    .line 702
    :pswitch_2
    new-instance p2, Ljava/lang/StringBuilder;

    const-string v0, "\ud83d\udeab @"

    invoke-direct {p2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p3, " \u00b7 Suspendu"

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 703
    sget p2, Lcom/prsocial/app/R$color;->error_red:I

    invoke-static {p0, p2}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result p2

    invoke-virtual {p1, p2}, Landroid/widget/TextView;->setTextColor(I)V

    :goto_1
    return-void

    :sswitch_data_0
    .sparse-switch
        -0x630a7225 -> :sswitch_2
        0x10263a7c -> :sswitch_1
        0x46a566b7 -> :sswitch_0
    .end sparse-switch

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_2
        :pswitch_1
        :pswitch_0
    .end packed-switch
.end method

.method private updateSubscriptionDetails()V
    .locals 8

    .line 2100
    sget v0, Lcom/prsocial/app/R$id;->tv_sub_status:I

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    .line 2101
    sget v1, Lcom/prsocial/app/R$id;->tv_sub_expire_date:I

    invoke-virtual {p0, v1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v1

    check-cast v1, Landroid/widget/TextView;

    .line 2102
    sget v2, Lcom/prsocial/app/R$id;->tv_sub_user_id:I

    invoke-virtual {p0, v2}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object v2

    check-cast v2, Landroid/widget/TextView;

    .line 2103
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->subMgr:Lcom/prsocial/app/SubscriptionManager;

    invoke-virtual {v3}, Lcom/prsocial/app/SubscriptionManager;->getCachedStatus()Lcom/prsocial/app/SubscriptionManager$SubscriptionStatus;

    move-result-object v3

    .line 2104
    iget-object v4, p0, Lcom/prsocial/app/MainActivity;->subMgr:Lcom/prsocial/app/SubscriptionManager;

    invoke-virtual {v4}, Lcom/prsocial/app/SubscriptionManager;->getUserId()Ljava/lang/String;

    move-result-object v4

    if-eqz v2, :cond_1

    if-eqz v4, :cond_0

    goto :goto_0

    .line 2105
    :cond_0
    const-string v4, "N/A"

    :goto_0
    invoke-virtual {v2, v4}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_1
    if-eqz v0, :cond_3

    .line 2107
    iget-boolean v2, v3, Lcom/prsocial/app/SubscriptionManager$SubscriptionStatus;->active:Z

    if-eqz v2, :cond_2

    iget-wide v4, v3, Lcom/prsocial/app/SubscriptionManager$SubscriptionStatus;->expiresAtMillis:J

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v6

    cmp-long v2, v4, v6

    if-lez v2, :cond_2

    .line 2108
    const-string v2, "Actif"

    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    const v2, -0xaf2267

    .line 2109
    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setTextColor(I)V

    goto :goto_1

    .line 2111
    :cond_2
    const-string v2, "Inactif"

    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    const v2, -0x9495

    .line 2112
    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setTextColor(I)V

    :cond_3
    :goto_1
    if-eqz v1, :cond_4

    .line 2115
    iget-wide v4, v3, Lcom/prsocial/app/SubscriptionManager$SubscriptionStatus;->expiresAtMillis:J

    const-wide/16 v6, 0x0

    cmp-long v0, v4, v6

    if-lez v0, :cond_4

    .line 2116
    new-instance v0, Ljava/text/SimpleDateFormat;

    const-string v2, "dd/MM/yyyy HH:mm"

    invoke-static {}, Ljava/util/Locale;->getDefault()Ljava/util/Locale;

    move-result-object v4

    invoke-direct {v0, v2, v4}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;Ljava/util/Locale;)V

    .line 2117
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "Expiration : "

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    new-instance v4, Ljava/util/Date;

    iget-wide v5, v3, Lcom/prsocial/app/SubscriptionManager$SubscriptionStatus;->expiresAtMillis:J

    invoke-direct {v4, v5, v6}, Ljava/util/Date;-><init>(J)V

    invoke-virtual {v0, v4}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_4
    return-void
.end method

.method private updateTelegramStatusUI()V
    .locals 3

    .line 1763
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTelegramStatus:Landroid/widget/TextView;

    if-nez v0, :cond_0

    return-void

    .line 1764
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tgSm:Lcom/prsocial/app/TelegramSessionManager;

    invoke-virtual {v0}, Lcom/prsocial/app/TelegramSessionManager;->isConnected()Z

    move-result v0

    if-eqz v0, :cond_1

    .line 1765
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTelegramStatus:Landroid/widget/TextView;

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "\u2714 App connect\u00e9 \u00b7 "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->tgSm:Lcom/prsocial/app/TelegramSessionManager;

    invoke-virtual {v2}, Lcom/prsocial/app/TelegramSessionManager;->getPhone()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 1766
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTelegramStatus:Landroid/widget/TextView;

    sget v1, Lcom/prsocial/app/R$color;->success_green:I

    invoke-static {p0, v1}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    .line 1767
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTelegram:Landroid/widget/Button;

    if-eqz v0, :cond_2

    const/high16 v1, 0x3f800000    # 1.0f

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setAlpha(F)V

    goto :goto_0

    .line 1769
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTelegramStatus:Landroid/widget/TextView;

    const-string v1, "\u26a0 Non configur\u00e9"

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 1770
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->tvTelegramStatus:Landroid/widget/TextView;

    sget v1, Lcom/prsocial/app/R$color;->warning_yellow:I

    invoke-static {p0, v1}, Landroidx/core/content/ContextCompat;->getColor(Landroid/content/Context;I)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    .line 1771
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTelegram:Landroid/widget/Button;

    if-eqz v0, :cond_2

    const v1, 0x3ecccccd    # 0.4f

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setAlpha(F)V

    :cond_2
    :goto_0
    return-void
.end method


# virtual methods
.method synthetic lambda$appendLog$40$com-prsocial-app-MainActivity(Ljava/lang/String;Landroid/view/View;)Z
    .locals 1

    .line 1655
    const-string p2, "clipboard"

    .line 1656
    invoke-virtual {p0, p2}, Lcom/prsocial/app/MainActivity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object p2

    check-cast p2, Landroid/content/ClipboardManager;

    .line 1657
    const-string v0, "url"

    invoke-static {v0, p1}, Landroid/content/ClipData;->newPlainText(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Landroid/content/ClipData;

    move-result-object p1

    invoke-virtual {p2, p1}, Landroid/content/ClipboardManager;->setPrimaryClip(Landroid/content/ClipData;)V

    .line 1658
    const-string p1, "URL copi\u00e9e \u2714"

    const/4 p2, 0x0

    invoke-static {p0, p1, p2}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    const/4 p1, 0x1

    return p1
.end method

.method synthetic lambda$appendLog$42$com-prsocial-app-MainActivity(Ljava/lang/String;ZLjava/lang/String;Ljava/lang/String;)V
    .locals 8

    .line 1630
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogContainer()Landroid/widget/LinearLayout;

    move-result-object v0

    .line 1631
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogScroll()Landroidx/core/widget/NestedScrollView;

    move-result-object v1

    .line 1632
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogHeader()Landroid/widget/LinearLayout;

    move-result-object v2

    if-nez v0, :cond_0

    return-void

    .line 1634
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    const/4 v3, 0x0

    if-eqz v2, :cond_1

    .line 1635
    invoke-virtual {v2, v3}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_1
    if-eqz v1, :cond_2

    .line 1636
    invoke-virtual {v1, v3}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 1638
    :cond_2
    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->logTimeFmt:Ljava/text/SimpleDateFormat;

    new-instance v4, Ljava/util/Date;

    invoke-direct {v4}, Ljava/util/Date;-><init>()V

    invoke-virtual {v2, v4}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v2

    .line 1639
    const-string v4, "https?://(www\\.)?"

    const-string v5, ""

    invoke-virtual {p1, v4, v5}, Ljava/lang/String;->replaceFirst(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 1640
    invoke-virtual {v4}, Ljava/lang/String;->length()I

    move-result v5

    const/16 v6, 0x2d

    if-le v5, v6, :cond_3

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    invoke-virtual {v4, v3, v6}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v4, "\u2026"

    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    .line 1642
    :cond_3
    new-instance v5, Landroid/widget/TextView;

    invoke-direct {v5, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 1643
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6}, Ljava/lang/StringBuilder;-><init>()V

    if-eqz p2, :cond_4

    const-string v7, "\u2714"

    goto :goto_0

    :cond_4
    const-string v7, "\u2716"

    :goto_0
    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v7, " ["

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v6, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, "] "

    invoke-virtual {v6, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v6, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p3, "  "

    invoke-virtual {v6, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v6, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p3

    invoke-virtual {v5, p3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    if-eqz p2, :cond_5

    const p2, -0xaf2267

    goto :goto_1

    :cond_5
    const p2, -0x9495

    .line 1644
    :goto_1
    invoke-virtual {v5, p2}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p2, 0x41300000    # 11.0f

    .line 1645
    invoke-virtual {v5, p2}, Landroid/widget/TextView;->setTextSize(F)V

    .line 1646
    sget-object p2, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v5, p2}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    .line 1649
    new-instance p2, Landroid/widget/TextView;

    invoke-direct {p2, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 1650
    new-instance p3, Ljava/lang/StringBuilder;

    const-string p4, "    \u21b3 "

    invoke-direct {p3, p4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p3

    invoke-virtual {p2, p3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    const p3, -0x8f6f01

    .line 1651
    invoke-virtual {p2, p3}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p3, 0x41200000    # 10.0f

    .line 1652
    invoke-virtual {p2, p3}, Landroid/widget/TextView;->setTextSize(F)V

    .line 1653
    sget-object p3, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {p2, p3}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    .line 1654
    new-instance p3, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda54;

    invoke-direct {p3, p0, p1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda54;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)V

    invoke-virtual {p2, p3}, Landroid/widget/TextView;->setOnLongClickListener(Landroid/view/View$OnLongClickListener;)V

    .line 1662
    new-instance p3, Landroid/widget/LinearLayout;

    invoke-direct {p3, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    const/4 p4, 0x1

    .line 1663
    invoke-virtual {p3, p4}, Landroid/widget/LinearLayout;->setOrientation(I)V

    const/4 p4, 0x2

    const/4 v2, 0x4

    .line 1664
    invoke-virtual {p3, v3, p4, v3, v2}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    .line 1665
    invoke-virtual {p3, v5}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1666
    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    move-result p1

    if-nez p1, :cond_6

    invoke-virtual {p3, p2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1667
    :cond_6
    invoke-virtual {v0, p3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1668
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda56;

    invoke-direct {p1, v1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda56;-><init>(Landroidx/core/widget/NestedScrollView;)V

    invoke-virtual {v1, p1}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    return-void
.end method

.method synthetic lambda$appendLogForPlatform$63$com-prsocial-app-MainActivity(Landroid/widget/LinearLayout;Landroidx/core/widget/NestedScrollView;ZLjava/lang/String;Ljava/lang/String;Landroid/widget/LinearLayout;)V
    .locals 4

    .line 0
    const/4 v0, 0x0

    if-eqz p1, :cond_0

    .line 2538
    invoke-virtual {p1, v0}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_0
    if-eqz p2, :cond_1

    .line 2539
    invoke-virtual {p2, v0}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 2540
    :cond_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->logTimeFmt:Ljava/text/SimpleDateFormat;

    new-instance v1, Ljava/util/Date;

    invoke-direct {v1}, Ljava/util/Date;-><init>()V

    invoke-virtual {p1, v1}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object p1

    .line 2541
    new-instance v1, Landroid/widget/TextView;

    invoke-direct {v1, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 2542
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-direct {v2}, Ljava/lang/StringBuilder;-><init>()V

    if-eqz p3, :cond_2

    const-string v3, "\u2705"

    goto :goto_0

    :cond_2
    const-string v3, "\u274c"

    :goto_0
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v3, " ["

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p1, "] "

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p1, " "

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2, p5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v1, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    if-eqz p3, :cond_3

    const p1, -0xaf2267

    goto :goto_1

    :cond_3
    const p1, -0x9495

    .line 2543
    :goto_1
    invoke-virtual {v1, p1}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p1, 0x41300000    # 11.0f

    .line 2544
    invoke-virtual {v1, p1}, Landroid/widget/TextView;->setTextSize(F)V

    .line 2545
    sget-object p1, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v1, p1}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    const/4 p1, 0x2

    .line 2546
    invoke-virtual {v1, v0, p1, v0, p1}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 2547
    invoke-virtual {p6, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    if-eqz p2, :cond_4

    .line 2548
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda66;

    invoke-direct {p1, p2}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda66;-><init>(Landroidx/core/widget/NestedScrollView;)V

    invoke-virtual {p2, p1}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    :cond_4
    return-void
.end method

.method synthetic lambda$appendMultiLog$60$com-prsocial-app-MainActivity()V
    .locals 2

    .line 2506
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    const/16 v1, 0x82

    invoke-virtual {v0, v1}, Landroidx/core/widget/NestedScrollView;->fullScroll(I)Z

    return-void
.end method

.method synthetic lambda$appendMultiLog$61$com-prsocial-app-MainActivity(Ljava/lang/String;I)V
    .locals 5

    .line 2494
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    if-nez v0, :cond_0

    return-void

    .line 2495
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogHeader:Landroid/widget/LinearLayout;

    const/4 v1, 0x0

    if-eqz v0, :cond_1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setVisibility(I)V

    .line 2496
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    if-eqz v0, :cond_2

    invoke-virtual {v0, v1}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 2497
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->logTimeFmt:Ljava/text/SimpleDateFormat;

    new-instance v2, Ljava/util/Date;

    invoke-direct {v2}, Ljava/util/Date;-><init>()V

    invoke-virtual {v0, v2}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v0

    .line 2498
    new-instance v2, Landroid/widget/TextView;

    invoke-direct {v2, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 2499
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "["

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, "] "

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v2, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 2500
    invoke-virtual {v2, p2}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p1, 0x41300000    # 11.0f

    .line 2501
    invoke-virtual {v2, p1}, Landroid/widget/TextView;->setTextSize(F)V

    .line 2502
    sget-object p1, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v2, p1}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    const/4 p1, 0x2

    .line 2503
    invoke-virtual {v2, v1, p1, v1, p1}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 2504
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    invoke-virtual {p1, v2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 2505
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    if-eqz p1, :cond_3

    .line 2506
    new-instance p2, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda23;

    invoke-direct {p2, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda23;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, p2}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    :cond_3
    return-void
.end method

.method synthetic lambda$bindMultiPanel$52$com-prsocial-app-MainActivity(Ljava/lang/String;Landroid/widget/Button;Landroid/view/View;)V
    .locals 2

    .line 2225
    iget-boolean p3, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz p3, :cond_0

    return-void

    .line 2226
    :cond_0
    sget-object p3, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiEnabled:Ljava/util/Map;

    invoke-interface {v0, p1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    invoke-virtual {p3, v0}, Ljava/lang/Boolean;->equals(Ljava/lang/Object;)Z

    move-result p3

    xor-int/lit8 p3, p3, 0x1

    .line 2227
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiEnabled:Ljava/util/Map;

    invoke-static {p3}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v1

    invoke-interface {v0, p1, v1}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 2228
    invoke-direct {p0, p2, p3}, Lcom/prsocial/app/MainActivity;->updateMultiToggleBtn(Landroid/widget/Button;Z)V

    return-void
.end method

.method synthetic lambda$bindMultiPanel$53$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 2238
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz p1, :cond_0

    .line 2239
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopMultiLaunch()V

    goto :goto_0

    .line 2241
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->startMultiLaunch()V

    :goto_0
    return-void
.end method

.method synthetic lambda$bindMultiPanel$54$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 1

    .line 2248
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogContainer:Landroid/widget/LinearLayout;

    if-eqz p1, :cond_0

    invoke-virtual {p1}, Landroid/widget/LinearLayout;->removeAllViews()V

    .line 2249
    :cond_0
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogScroll:Landroidx/core/widget/NestedScrollView;

    const/16 v0, 0x8

    if-eqz p1, :cond_1

    invoke-virtual {p1, v0}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 2250
    :cond_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiLogHeader:Landroid/widget/LinearLayout;

    if-eqz p1, :cond_2

    invoke-virtual {p1, v0}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_2
    return-void
.end method

.method synthetic lambda$bindViews$12$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 354
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->emailVisible:Z

    xor-int/lit8 p1, p1, 0x1

    iput-boolean p1, p0, Lcom/prsocial/app/MainActivity;->emailVisible:Z

    .line 355
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->updateEmailDisplay()V

    return-void
.end method

.method synthetic lambda$bindViews$13$com-prsocial-app-MainActivity()V
    .locals 0

    .line 365
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadDashboard()V

    .line 366
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadMe()V

    .line 367
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->checkAllSocialAccounts()V

    .line 368
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runSubscriptionCheck()V

    return-void
.end method

.method synthetic lambda$bindViews$14$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 1

    .line 372
    const-string p1, "instagram"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result p1

    if-nez p1, :cond_0

    .line 373
    const-string p1, "Aucun compte Instagram li\u00e9 sur PR.Social"

    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return-void

    .line 376
    :cond_0
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz p1, :cond_1

    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-nez p1, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopAutomation()V

    return-void

    .line 377
    :cond_1
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartTasks()V

    return-void
.end method

.method synthetic lambda$bindViews$15$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 381
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {p1}, Lcom/prsocial/app/SessionManager;->clearAutomationBlock()V

    .line 382
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    .line 383
    new-instance p1, Landroid/content/Intent;

    const-class v0, Lcom/prsocial/app/WebViewActivity;

    invoke-direct {p1, p0, v0}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 384
    const-string v0, "url"

    const-string v1, "https://www.instagram.com/"

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 385
    const-string v0, "mode"

    const-string v1, "instagram"

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 386
    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->startActivity(Landroid/content/Intent;)V

    return-void
.end method

.method synthetic lambda$bindViews$16$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 1

    .line 395
    const-string p1, "https://www.tiktok.com/"

    const-string v0, "tiktok"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$bindViews$17$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 397
    const-string p1, "tiktok"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 398
    const-string p1, "Aucun compte TikTok li\u00e9 sur PR.Social"

    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return-void

    .line 401
    :cond_0
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v0, :cond_1

    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopAutomation()V

    return-void

    .line 402
    :cond_1
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v0, :cond_2

    return-void

    .line 403
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->progressTikTok:Landroid/widget/ProgressBar;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    invoke-direct {p0, p1, v0, v1}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartManualTasks(Ljava/lang/String;Landroid/widget/ProgressBar;Landroid/widget/Button;)V

    return-void
.end method

.method synthetic lambda$bindViews$18$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 1

    .line 412
    const-string p1, "https://www.threads.net/"

    const-string v0, "threads"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$bindViews$19$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 414
    const-string p1, "threads"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 415
    const-string p1, "Aucun compte Threads li\u00e9 sur PR.Social"

    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return-void

    .line 418
    :cond_0
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v0, :cond_1

    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopAutomation()V

    return-void

    .line 419
    :cond_1
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v0, :cond_2

    return-void

    .line 420
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->progressThreads:Landroid/widget/ProgressBar;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    invoke-direct {p0, p1, v0, v1}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartManualTasks(Ljava/lang/String;Landroid/widget/ProgressBar;Landroid/widget/Button;)V

    return-void
.end method

.method synthetic lambda$bindViews$20$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 1

    .line 429
    const-string p1, "https://www.youtube.com/"

    const-string v0, "youtube"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$bindViews$21$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 431
    const-string p1, "youtube"

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isPlatformLinked(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    .line 432
    const-string p1, "Aucun compte YouTube li\u00e9 sur PR.Social"

    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return-void

    .line 435
    :cond_0
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v0, :cond_1

    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopAutomation()V

    return-void

    .line 436
    :cond_1
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz v0, :cond_2

    return-void

    .line 437
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->progressYouTube:Landroid/widget/ProgressBar;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    invoke-direct {p0, p1, v0, v1}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartManualTasks(Ljava/lang/String;Landroid/widget/ProgressBar;Landroid/widget/Button;)V

    return-void
.end method

.method synthetic lambda$bindViews$22$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 1

    .line 451
    const-string p1, "https://web.telegram.org/k/"

    const-string v0, "telegram"

    invoke-direct {p0, p1, v0}, Lcom/prsocial/app/MainActivity;->openSocialWebView(Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$bindViews$23$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 456
    new-instance p1, Landroid/content/Intent;

    const-class v0, Lcom/prsocial/app/TelegramConnectActivity;

    invoke-direct {p1, p0, v0}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 458
    const-string v0, "open_app"

    const/4 v1, 0x1

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 459
    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->startActivity(Landroid/content/Intent;)V

    return-void
.end method

.method synthetic lambda$bindViews$24$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 463
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->tgSm:Lcom/prsocial/app/TelegramSessionManager;

    invoke-virtual {p1}, Lcom/prsocial/app/TelegramSessionManager;->isConnected()Z

    move-result p1

    if-nez p1, :cond_0

    .line 464
    const-string p1, "Configurez d\'abord Telegram App"

    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    .line 465
    new-instance p1, Landroid/content/Intent;

    const-class v0, Lcom/prsocial/app/TelegramConnectActivity;

    invoke-direct {p1, p0, v0}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 466
    const-string v0, "open_app"

    const/4 v1, 0x1

    invoke-virtual {p1, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 467
    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->startActivity(Landroid/content/Intent;)V

    return-void

    .line 470
    :cond_0
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz p1, :cond_1

    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz p1, :cond_1

    const-string p1, "telegram"

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->stopAutomation()V

    return-void

    .line 471
    :cond_1
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-eqz p1, :cond_2

    return-void

    .line 472
    :cond_2
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartTelegramTasks()V

    return-void
.end method

.method synthetic lambda$bindViews$25$com-prsocial-app-MainActivity(Landroid/content/DialogInterface;I)V
    .locals 0

    .line 479
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->logout()V

    return-void
.end method

.method synthetic lambda$bindViews$26$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 476
    new-instance p1, Landroid/app/AlertDialog$Builder;

    invoke-direct {p1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v0, "D\u00e9connexion"

    .line 477
    invoke-virtual {p1, v0}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    const-string v0, "Voulez-vous vraiment vous d\u00e9connecter ?"

    .line 478
    invoke-virtual {p1, v0}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda17;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda17;-><init>(Lcom/prsocial/app/MainActivity;)V

    .line 479
    const-string v1, "Oui"

    invoke-virtual {p1, v1, v0}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    const-string v0, "Annuler"

    const/4 v1, 0x0

    .line 480
    invoke-virtual {p1, v0, v1}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    .line 481
    invoke-virtual {p1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    return-void
.end method

.method synthetic lambda$clearStatusRow$39$com-prsocial-app-MainActivity()V
    .locals 2

    .line 1614
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    if-eqz v0, :cond_2

    .line 1616
    invoke-virtual {v0}, Landroid/widget/LinearLayout;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    if-eqz v0, :cond_0

    .line 1617
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v0}, Landroid/widget/LinearLayout;->getParent()Landroid/view/ViewParent;

    move-result-object v0

    check-cast v0, Landroid/view/ViewGroup;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v1}, Landroid/view/ViewGroup;->removeView(Landroid/view/View;)V

    goto :goto_0

    .line 1618
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRowContainer:Landroid/widget/LinearLayout;

    if-eqz v0, :cond_1

    .line 1619
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->removeView(Landroid/view/View;)V

    :cond_1
    :goto_0
    const/4 v0, 0x0

    .line 1621
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    .line 1622
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRowContainer:Landroid/widget/LinearLayout;

    :cond_2
    return-void
.end method

.method synthetic lambda$executeTelegramJoin$44$com-prsocial-app-MainActivity(Lcom/prsocial/app/TelegramActionClient$TgResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 8

    .line 1936
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    .line 1937
    iget-object v0, p1, Lcom/prsocial/app/TelegramActionClient$TgResult;->action:Lcom/prsocial/app/InstagramActionClient$ActionResult;

    .line 1939
    iget-boolean v1, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->success:Z

    if-eqz v1, :cond_1

    .line 1941
    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    iget-object v0, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v0, " \u2192 capture"

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    const-string v3, "telegram"

    const-string v4, "JOIN"

    const/4 v6, 0x1

    move-object v2, p0

    move-object v5, p2

    invoke-direct/range {v2 .. v7}, Lcom/prsocial/app/MainActivity;->appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    .line 1943
    const-string v0, "\ud83d\udcf8 Capture Telegram Web..."

    const v1, -0x9b4a0a

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    .line 1944
    iget-object v0, p1, Lcom/prsocial/app/TelegramActionClient$TgResult;->telegramWebUrl:Ljava/lang/String;

    if-eqz v0, :cond_0

    .line 1945
    iget-object p1, p1, Lcom/prsocial/app/TelegramActionClient$TgResult;->telegramWebUrl:Ljava/lang/String;

    goto :goto_0

    .line 1946
    :cond_0
    invoke-static {p2}, Lcom/prsocial/app/TelegramActionClient;->buildTelegramWebUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    :goto_0
    move-object v2, p1

    .line 1947
    const-string v6, "telegram"

    const/4 v7, 0x1

    const-string v3, "Join Telegram"

    const-string v4, "JOIN"

    move-object v0, p0

    move-object v1, p3

    move-object v5, p4

    invoke-direct/range {v0 .. v7}, Lcom/prsocial/app/MainActivity;->launchWebView(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Z)V

    goto/16 :goto_2

    .line 1949
    :cond_1
    const-string p1, "RESOLVE_FAILED"

    iget-object p4, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {p1, p4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_4

    const-string p1, "INVALID_TARGET"

    iget-object p4, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-virtual {p1, p4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_2

    goto :goto_1

    .line 1965
    :cond_2
    iget-object p1, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->isCriticalTelegramState(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_3

    const/4 v5, 0x0

    .line 1967
    iget-object v6, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    const-string v2, "telegram"

    const-string v3, "JOIN"

    move-object v1, p0

    move-object v4, p2

    invoke-direct/range {v1 .. v6}, Lcom/prsocial/app/MainActivity;->appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    .line 1969
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object p2, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->state:Ljava/lang/String;

    iget-object p4, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    const-string v1, "telegram"

    invoke-virtual {p1, v1, p2, p4}, Lcom/prsocial/app/SessionManager;->saveAutomationBlockForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 1970
    iget-object p1, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    iget-object p2, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTelegram:Landroid/widget/LinearLayout;

    invoke-static {p0, v1, p1, p2}, Lcom/prsocial/app/AlertSoundManager;->playAlert(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Landroid/widget/LinearLayout;)V

    .line 1972
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance p2, Lcom/prsocial/app/MainActivity$17;

    invoke-direct {p2, p0, v0}, Lcom/prsocial/app/MainActivity$17;-><init>(Lcom/prsocial/app/MainActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V

    invoke-static {p1, p3, p2}, Lcom/prsocial/app/ApiClient;->cancelTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    goto :goto_2

    :cond_3
    const/4 v5, 0x0

    .line 1982
    iget-object v6, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    const-string v2, "telegram"

    const-string v3, "JOIN"

    move-object v1, p0

    move-object v4, p2

    invoke-direct/range {v1 .. v6}, Lcom/prsocial/app/MainActivity;->appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    .line 1983
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeTelegramTaskAndNext()V

    goto :goto_2

    .line 1951
    :cond_4
    :goto_1
    new-instance p1, Ljava/lang/StringBuilder;

    invoke-direct {p1}, Ljava/lang/StringBuilder;-><init>()V

    iget-object p4, v0, Lcom/prsocial/app/InstagramActionClient$ActionResult;->message:Ljava/lang/String;

    invoke-virtual {p1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string p4, " \u2192 report"

    invoke-virtual {p1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    const-string v1, "telegram"

    const-string v2, "JOIN"

    const/4 v4, 0x0

    move-object v0, p0

    move-object v3, p2

    invoke-direct/range {v0 .. v5}, Lcom/prsocial/app/MainActivity;->appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    .line 1953
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    new-instance p4, Lcom/prsocial/app/MainActivity$16;

    invoke-direct {p4, p0, p2}, Lcom/prsocial/app/MainActivity$16;-><init>(Lcom/prsocial/app/MainActivity;Ljava/lang/String;)V

    invoke-static {p1, p3, p4}, Lcom/prsocial/app/ApiClient;->reportTask(Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/ApiClient$Callback;)V

    :goto_2
    return-void
.end method

.method synthetic lambda$executeTelegramJoin$45$com-prsocial-app-MainActivity(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/TelegramActionClient$TgResult;)V
    .locals 7

    .line 1935
    new-instance v6, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda1;

    move-object v0, v6

    move-object v1, p0

    move-object v2, p4

    move-object v3, p1

    move-object v4, p2

    move-object v5, p3

    invoke-direct/range {v0 .. v5}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda1;-><init>(Lcom/prsocial/app/MainActivity;Lcom/prsocial/app/TelegramActionClient$TgResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {p0, v6}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$onCreate$0$com-prsocial-app-MainActivity()V
    .locals 3

    .line 169
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 171
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    .line 172
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 173
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "\ud83d\udeab "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, ": "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const v2, -0x9495

    invoke-direct {p0, v1, v2}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 174
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onMultiPlatformDone(Ljava/lang/String;)V

    return-void

    .line 177
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-interface {v0, v1}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/List;

    if-eqz v0, :cond_2

    .line 178
    invoke-interface {v0}, Ljava/util/List;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_2

    .line 179
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    .line 180
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTask()V

    goto :goto_0

    .line 182
    :cond_2
    const-string v0, "plus de t\u00e2ches"

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->onMultiPlatformDone(Ljava/lang/String;)V

    :goto_0
    return-void
.end method

.method synthetic lambda$onCreate$1$com-prsocial-app-MainActivity(Landroidx/activity/result/ActivityResult;)V
    .locals 3

    .line 149
    invoke-virtual {p1}, Landroidx/activity/result/ActivityResult;->getResultCode()I

    move-result p1

    const/4 v0, -0x1

    if-ne p1, v0, :cond_7

    .line 151
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    const-string v0, "telegram"

    if-eqz p1, :cond_4

    .line 153
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {p1, v1}, Lcom/prsocial/app/SessionManager;->hasAutomationBlockForPlatform(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_0

    .line 154
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {p1, v0}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    .line 155
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\ud83d\udeab "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, ": "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const v1, -0x9495

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendMultiLog(Ljava/lang/String;I)V

    .line 156
    invoke-direct {p0, p1}, Lcom/prsocial/app/MainActivity;->onMultiPlatformDone(Ljava/lang/String;)V

    return-void

    .line 159
    :cond_0
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    .line 160
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeTelegramTaskAndNext()V

    return-void

    .line 163
    :cond_1
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    invoke-interface {p1, v0}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object p1

    check-cast p1, Ljava/util/List;

    if-eqz p1, :cond_2

    .line 164
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {p1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_2

    .line 165
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    invoke-interface {p1, v0}, Ljava/util/List;->remove(I)Ljava/lang/Object;

    .line 167
    :cond_2
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiTaskLists:Ljava/util/Map;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    if-eqz p1, :cond_3

    goto :goto_0

    :cond_3
    new-instance p1, Ljava/util/ArrayList;

    invoke-direct {p1}, Ljava/util/ArrayList;-><init>()V

    :goto_0
    invoke-interface {v0, v1, p1}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 168
    new-instance p1, Landroid/os/Handler;

    invoke-static {}, Landroid/os/Looper;->getMainLooper()Landroid/os/Looper;

    move-result-object v0

    invoke-direct {p1, v0}, Landroid/os/Handler;-><init>(Landroid/os/Looper;)V

    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda15;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda15;-><init>(Lcom/prsocial/app/MainActivity;)V

    const-wide/16 v1, 0x1388

    invoke-virtual {p1, v0, v1, v2}, Landroid/os/Handler;->postDelayed(Ljava/lang/Runnable;J)Z

    goto :goto_1

    .line 185
    :cond_4
    iget-boolean p1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz p1, :cond_6

    .line 186
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_5

    .line 187
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeTelegramTaskAndNext()V

    goto :goto_1

    .line 189
    :cond_5
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeCurrentManualTaskAndLoadNext()V

    goto :goto_1

    .line 192
    :cond_6
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeCurrentTaskAndLoadNext()V

    :cond_7
    :goto_1
    return-void
.end method

.method synthetic lambda$onCreate$10$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 315
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearTaskLog()V

    return-void
.end method

.method synthetic lambda$onCreate$11$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 317
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearTaskLog()V

    return-void
.end method

.method synthetic lambda$onCreate$2$com-prsocial-app-MainActivity(ZLjava/lang/String;)V
    .locals 7

    .line 207
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->currentMultiPlatform:Ljava/lang/String;

    goto :goto_0

    .line 208
    :cond_0
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    goto :goto_0

    :cond_1
    const-string v0, "instagram"

    .line 209
    :goto_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearStatusRow()V

    .line 210
    iget-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-eqz v1, :cond_2

    const-string v1, "SUBMIT"

    :goto_1
    move-object v3, v1

    goto :goto_2

    :cond_2
    iget-boolean v1, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v1, :cond_3

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->toUpperCase()Ljava/lang/String;

    move-result-object v1

    goto :goto_1

    :cond_3
    const-string v1, "INSTAGRAM"

    goto :goto_1

    :goto_2
    const-string v4, ""

    move-object v1, p0

    move-object v2, v0

    move v5, p1

    move-object v6, p2

    invoke-direct/range {v1 .. v6}, Lcom/prsocial/app/MainActivity;->appendLogForPlatform(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;)V

    if-eqz p1, :cond_5

    .line 213
    const-string p1, "telegram"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_4

    .line 215
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->removeTelegramTaskAndNext()V

    goto :goto_3

    :cond_4
    const/4 p1, 0x5

    .line 217
    invoke-direct {p0, v0, p1}, Lcom/prsocial/app/MainActivity;->appendCountdownThenNext(Ljava/lang/String;I)V

    :cond_5
    :goto_3
    return-void
.end method

.method synthetic lambda$onCreate$3$com-prsocial-app-MainActivity(Ljava/lang/String;ZLjava/lang/String;)V
    .locals 0

    .line 206
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda60;

    invoke-direct {p1, p0, p2, p3}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda60;-><init>(Lcom/prsocial/app/MainActivity;ZLjava/lang/String;)V

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$onCreate$4$com-prsocial-app-MainActivity()V
    .locals 2

    .line 222
    const-string v0, "\ud83d\udce4 Soumission en cours..."

    const/16 v1, -0x48b3

    invoke-direct {p0, v0, v1}, Lcom/prsocial/app/MainActivity;->appendSpinnerRow(Ljava/lang/String;I)V

    return-void
.end method

.method synthetic lambda$onCreate$5$com-prsocial-app-MainActivity()V
    .locals 1

    .line 221
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda53;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda53;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$onCreate$6$com-prsocial-app-MainActivity(Landroid/widget/CompoundButton;Z)V
    .locals 0

    .line 230
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {p1, p2}, Lcom/prsocial/app/SessionManager;->setAlertSoundEnabled(Z)V

    if-nez p2, :cond_0

    .line 231
    invoke-static {}, Lcom/prsocial/app/AlertSoundManager;->stopAlert()V

    :cond_0
    return-void
.end method

.method synthetic lambda$onCreate$7$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 309
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearTaskLog()V

    return-void
.end method

.method synthetic lambda$onCreate$8$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 311
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearTaskLog()V

    return-void
.end method

.method synthetic lambda$onCreate$9$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    .line 313
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->clearTaskLog()V

    return-void
.end method

.method synthetic lambda$onMultiPlatformDone$56$com-prsocial-app-MainActivity()V
    .locals 0

    .line 2426
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->runNextMultiPlatform()V

    return-void
.end method

.method synthetic lambda$performHttpActionThenLaunch$29$com-prsocial-app-MainActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 1405
    invoke-direct/range {p0 .. p7}, Lcom/prsocial/app/MainActivity;->onHttpActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$performHttpActionThenLaunch$30$com-prsocial-app-MainActivity(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 10

    .line 1405
    new-instance v9, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda21;

    move-object v0, v9

    move-object v1, p0

    move-object/from16 v2, p7

    move-object v3, p1

    move-object v4, p2

    move-object v5, p3

    move-object v6, p4

    move-object v7, p5

    move-object/from16 v8, p6

    invoke-direct/range {v0 .. v8}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda21;-><init>(Lcom/prsocial/app/MainActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    move-object v0, p0

    invoke-virtual {p0, v9}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$performHttpActionThenLaunch$31$com-prsocial-app-MainActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 1409
    invoke-direct/range {p0 .. p7}, Lcom/prsocial/app/MainActivity;->onHttpActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$performHttpActionThenLaunch$32$com-prsocial-app-MainActivity(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 10

    .line 1409
    new-instance v9, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda59;

    move-object v0, v9

    move-object v1, p0

    move-object/from16 v2, p7

    move-object v3, p1

    move-object v4, p2

    move-object v5, p3

    move-object v6, p4

    move-object v7, p5

    move-object/from16 v8, p6

    invoke-direct/range {v0 .. v8}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda59;-><init>(Lcom/prsocial/app/MainActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    move-object v0, p0

    invoke-virtual {p0, v9}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$performHttpActionThenLaunch$33$com-prsocial-app-MainActivity(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 1412
    invoke-direct/range {p0 .. p7}, Lcom/prsocial/app/MainActivity;->onHttpActionResult(Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method synthetic lambda$performHttpActionThenLaunch$34$com-prsocial-app-MainActivity(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Lcom/prsocial/app/InstagramActionClient$ActionResult;)V
    .locals 10

    .line 1412
    new-instance v9, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda57;

    move-object v0, v9

    move-object v1, p0

    move-object/from16 v2, p7

    move-object v3, p1

    move-object v4, p2

    move-object v5, p3

    move-object v6, p4

    move-object v7, p5

    move-object/from16 v8, p6

    invoke-direct/range {v0 .. v8}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda57;-><init>(Lcom/prsocial/app/MainActivity;Lcom/prsocial/app/InstagramActionClient$ActionResult;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    move-object v0, p0

    invoke-virtual {p0, v9}, Lcom/prsocial/app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method synthetic lambda$removeCurrentManualTaskAndLoadNext$28$com-prsocial-app-MainActivity()V
    .locals 3

    .line 1018
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 1019
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_1

    .line 1020
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentManualTask()V

    goto :goto_0

    .line 1023
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    .line 1024
    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->getProgressForPlatform(Ljava/lang/String;)Landroid/widget/ProgressBar;

    move-result-object v1

    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    .line 1025
    invoke-direct {p0, v2}, Lcom/prsocial/app/MainActivity;->getButtonForPlatform(Ljava/lang/String;)Landroid/widget/Button;

    move-result-object v2

    .line 1023
    invoke-direct {p0, v0, v1, v2}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartManualTasks(Ljava/lang/String;Landroid/widget/ProgressBar;Landroid/widget/Button;)V

    :goto_0
    return-void
.end method

.method synthetic lambda$removeCurrentTaskAndLoadNext$43$com-prsocial-app-MainActivity()V
    .locals 2

    .line 1741
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 1742
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_1

    .line 1743
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTask()V

    goto :goto_0

    .line 1745
    :cond_1
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartTasks()V

    :goto_0
    return-void
.end method

.method synthetic lambda$removeTelegramTaskAndNext$46$com-prsocial-app-MainActivity()V
    .locals 2

    .line 0
    const/4 v0, 0x0

    .line 2009
    iput-boolean v0, p0, Lcom/prsocial/app/MainActivity;->telegramNextScheduled:Z

    .line 2010
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 2011
    :cond_0
    iget v0, p0, Lcom/prsocial/app/MainActivity;->currentTaskIndex:I

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->taskList:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    if-ge v0, v1, :cond_1

    .line 2012
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->launchCurrentTelegramTask()V

    goto :goto_0

    .line 2014
    :cond_1
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadAndAutoStartTelegramTasks()V

    :goto_0
    return-void
.end method

.method synthetic lambda$runNextMultiPlatform$55$com-prsocial-app-MainActivity()V
    .locals 1

    .line 2384
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isMultiRunning:Z

    if-nez v0, :cond_0

    return-void

    .line 2385
    :cond_0
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->fetchAllMultiTasks()V

    return-void
.end method

.method synthetic lambda$runSubscriptionCheck$51$com-prsocial-app-MainActivity(Ljava/lang/String;Lcom/prsocial/app/SubscriptionManager$SubscriptionStatus;)V
    .locals 0

    return-void
.end method

.method synthetic lambda$setMultiOverlay$58$com-prsocial-app-MainActivity(Z)V
    .locals 2

    .line 2466
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->multiOverlay:Landroid/widget/LinearLayout;

    if-eqz v0, :cond_1

    if-eqz p1, :cond_0

    const/4 v1, 0x0

    goto :goto_0

    :cond_0
    const/16 v1, 0x8

    .line 2467
    :goto_0
    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setVisibility(I)V

    .line 2470
    :cond_1
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->swipeRefresh:Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;

    if-eqz v0, :cond_2

    xor-int/lit8 p1, p1, 0x1

    invoke-virtual {v0, p1}, Landroidx/swiperefreshlayout/widget/SwipeRefreshLayout;->setEnabled(Z)V

    :cond_2
    return-void
.end method

.method synthetic lambda$setRunningState$27$com-prsocial-app-MainActivity(Z)V
    .locals 11

    .line 756
    iget-boolean v0, p0, Lcom/prsocial/app/MainActivity;->isManualMode:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->manualPlatform:Ljava/lang/String;

    invoke-direct {p0, v0}, Lcom/prsocial/app/MainActivity;->getButtonForPlatform(Ljava/lang/String;)Landroid/widget/Button;

    move-result-object v0

    goto :goto_0

    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    :goto_0
    if-eqz p1, :cond_1

    .line 757
    const-string v1, "\u23f9\ufe0f Stop"

    goto :goto_1

    :cond_1
    const-string v1, "\u25b6\ufe0f Lancer"

    :goto_1
    invoke-virtual {v0, v1}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    const/high16 v1, 0x3f800000    # 1.0f

    .line 758
    invoke-virtual {v0, v1}, Landroid/widget/Button;->setAlpha(F)V

    const/4 v2, 0x1

    .line 759
    invoke-virtual {v0, v2}, Landroid/widget/Button;->setEnabled(Z)V

    .line 762
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->btnLoadTasks:Landroid/widget/Button;

    iget-object v4, p0, Lcom/prsocial/app/MainActivity;->btnLoadTikTok:Landroid/widget/Button;

    iget-object v5, p0, Lcom/prsocial/app/MainActivity;->btnLoadThreads:Landroid/widget/Button;

    iget-object v6, p0, Lcom/prsocial/app/MainActivity;->btnLoadYouTube:Landroid/widget/Button;

    iget-object v7, p0, Lcom/prsocial/app/MainActivity;->btnLoadTelegram:Landroid/widget/Button;

    const/4 v8, 0x5

    new-array v9, v8, [Landroid/widget/Button;

    const/4 v10, 0x0

    aput-object v3, v9, v10

    aput-object v4, v9, v2

    const/4 v2, 0x2

    aput-object v5, v9, v2

    const/4 v2, 0x3

    aput-object v6, v9, v2

    const/4 v2, 0x4

    aput-object v7, v9, v2

    :goto_2
    if-ge v10, v8, :cond_4

    .line 763
    aget-object v2, v9, v10

    if-eq v2, v0, :cond_3

    xor-int/lit8 v3, p1, 0x1

    .line 765
    invoke-virtual {v2, v3}, Landroid/widget/Button;->setEnabled(Z)V

    if-eqz p1, :cond_2

    const v3, 0x3eb33333    # 0.35f

    goto :goto_3

    :cond_2
    const/high16 v3, 0x3f800000    # 1.0f

    .line 766
    :goto_3
    invoke-virtual {v2, v3}, Landroid/widget/Button;->setAlpha(F)V

    :cond_3
    add-int/lit8 v10, v10, 0x1

    goto :goto_2

    :cond_4
    return-void
.end method

.method synthetic lambda$setStatusRow$38$com-prsocial-app-MainActivity(Ljava/lang/String;I)V
    .locals 5

    .line 1588
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogContainer()Landroid/widget/LinearLayout;

    move-result-object v0

    .line 1589
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogScroll()Landroidx/core/widget/NestedScrollView;

    move-result-object v1

    .line 1590
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->getActiveLogHeader()Landroid/widget/LinearLayout;

    move-result-object v2

    if-nez v0, :cond_0

    return-void

    :cond_0
    const/4 v3, 0x0

    if-eqz v2, :cond_1

    .line 1592
    invoke-virtual {v2, v3}, Landroid/widget/LinearLayout;->setVisibility(I)V

    :cond_1
    if-eqz v1, :cond_2

    .line 1593
    invoke-virtual {v1, v3}, Landroidx/core/widget/NestedScrollView;->setVisibility(I)V

    .line 1594
    :cond_2
    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    if-eqz v2, :cond_3

    invoke-virtual {v2}, Landroid/widget/LinearLayout;->getParent()Landroid/view/ViewParent;

    move-result-object v2

    if-eqz v2, :cond_3

    .line 1595
    iget-object v2, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v2}, Landroid/widget/LinearLayout;->getParent()Landroid/view/ViewParent;

    move-result-object v2

    check-cast v2, Landroid/view/ViewGroup;

    iget-object v4, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v2, v4}, Landroid/view/ViewGroup;->removeView(Landroid/view/View;)V

    .line 1596
    :cond_3
    new-instance v2, Landroid/widget/TextView;

    invoke-direct {v2, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    .line 1597
    invoke-virtual {v2, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 1598
    invoke-virtual {v2, p2}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p1, 0x41300000    # 11.0f

    .line 1599
    invoke-virtual {v2, p1}, Landroid/widget/TextView;->setTextSize(F)V

    .line 1600
    sget-object p1, Landroid/graphics/Typeface;->MONOSPACE:Landroid/graphics/Typeface;

    invoke-virtual {v2, p1}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V

    const/4 p1, 0x2

    const/4 p2, 0x4

    .line 1601
    invoke-virtual {v2, v3, p1, v3, p2}, Landroid/widget/TextView;->setPadding(IIII)V

    .line 1602
    new-instance p1, Landroid/widget/LinearLayout;

    invoke-direct {p1, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    const/4 p2, 0x1

    .line 1603
    invoke-virtual {p1, p2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    .line 1604
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {p1, v2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1605
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->statusRow:Landroid/widget/LinearLayout;

    invoke-virtual {v0, p1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 1606
    iput-object v0, p0, Lcom/prsocial/app/MainActivity;->statusRowContainer:Landroid/widget/LinearLayout;

    .line 1607
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda58;

    invoke-direct {p1, v1}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda58;-><init>(Landroidx/core/widget/NestedScrollView;)V

    invoke-virtual {v1, p1}, Landroidx/core/widget/NestedScrollView;->post(Ljava/lang/Runnable;)Z

    return-void
.end method

.method synthetic lambda$setupSubscriptionUI$47$com-prsocial-app-MainActivity(Landroid/widget/LinearLayout;Landroid/widget/TextView;Landroid/view/View;)V
    .locals 0

    .line 2054
    invoke-virtual {p1}, Landroid/widget/LinearLayout;->getVisibility()I

    move-result p3

    if-nez p3, :cond_0

    const/16 p3, 0x8

    .line 2057
    invoke-virtual {p1, p3}, Landroid/widget/LinearLayout;->setVisibility(I)V

    .line 2058
    const-string p1, "\u25bc"

    invoke-virtual {p2, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    goto :goto_0

    :cond_0
    const/4 p3, 0x0

    .line 2061
    invoke-virtual {p1, p3}, Landroid/widget/LinearLayout;->setVisibility(I)V

    .line 2062
    const-string p1, "\u25b2"

    invoke-virtual {p2, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 2064
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->updateSubscriptionDetails()V

    :goto_0
    return-void
.end method

.method synthetic lambda$setupSubscriptionUI$48$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    return-void
.end method

.method synthetic lambda$setupSubscriptionUI$49$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 0

    return-void
.end method

.method synthetic lambda$setupSubscriptionUI$50$com-prsocial-app-MainActivity(Landroid/view/View;)V
    .locals 2

    .line 2084
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->subMgr:Lcom/prsocial/app/SubscriptionManager;

    invoke-virtual {p1}, Lcom/prsocial/app/SubscriptionManager;->getUserId()Ljava/lang/String;

    move-result-object p1

    if-nez p1, :cond_0

    return-void

    .line 2086
    :cond_0
    const-string v0, "clipboard"

    invoke-virtual {p0, v0}, Lcom/prsocial/app/MainActivity;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/content/ClipboardManager;

    .line 2087
    const-string v1, "ID"

    invoke-static {v1, p1}, Landroid/content/ClipData;->newPlainText(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Landroid/content/ClipData;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/ClipboardManager;->setPrimaryClip(Landroid/content/ClipData;)V

    .line 2088
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "ID copie : "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return-void
.end method

.method synthetic lambda$showAllPlatformsBlockedBanner$57$com-prsocial-app-MainActivity()V
    .locals 5

    .line 2446
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\ud83d\udea8 Tous les comptes ont un probl\u00e8me :\n\n"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    .line 2448
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->multiQueue:Ljava/util/List;

    invoke-interface {v1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :cond_0
    :goto_0
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-eqz v2, :cond_1

    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    .line 2449
    iget-object v3, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v3, v2}, Lcom/prsocial/app/SessionManager;->getAutomationBlockMessageForPlatform(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    if-eqz v3, :cond_0

    .line 2450
    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v4

    if-nez v4, :cond_0

    .line 2451
    const-string v4, "\u2022 "

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, ": "

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, "\n"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_0

    .line 2454
    :cond_1
    const-string v1, "\nReconnectez vos comptes pour reprendre."

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    .line 2455
    new-instance v1, Landroid/app/AlertDialog$Builder;

    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v2, "\u26a0 Automatisation stopp\u00e9e"

    .line 2456
    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    .line 2457
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    const-string v1, "OK"

    const/4 v2, 0x0

    .line 2458
    invoke-virtual {v0, v1, v2}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    .line 2459
    invoke-virtual {v0}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    .line 2460
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 2

    .line 130
    invoke-super {p0, p1}, Landroidx/appcompat/app/AppCompatActivity;->onCreate(Landroid/os/Bundle;)V

    .line 131
    invoke-virtual {p0}, Lcom/prsocial/app/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object p1

    const/4 v0, 0x1

    invoke-static {p1, v0}, Landroidx/core/view/WindowCompat;->setDecorFitsSystemWindows(Landroid/view/Window;Z)V

    .line 132
    sget p1, Lcom/prsocial/app/R$layout;->activity_main:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->setContentView(I)V

    .line 134
    new-instance p1, Lcom/prsocial/app/SessionManager;

    invoke-direct {p1, p0}, Lcom/prsocial/app/SessionManager;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    .line 135
    invoke-virtual {p1}, Lcom/prsocial/app/SessionManager;->getToken()Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    .line 136
    new-instance p1, Lcom/prsocial/app/TelegramSessionManager;

    invoke-direct {p1, p0}, Lcom/prsocial/app/TelegramSessionManager;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->tgSm:Lcom/prsocial/app/TelegramSessionManager;

    .line 137
    new-instance p1, Lcom/prsocial/app/SubscriptionManager;

    invoke-direct {p1, p0}, Lcom/prsocial/app/SubscriptionManager;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->subMgr:Lcom/prsocial/app/SubscriptionManager;

    .line 139
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {p1}, Lcom/prsocial/app/SessionManager;->clearAutomationBlock()V

    .line 140
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->token:Ljava/lang/String;

    if-nez p1, :cond_0

    .line 141
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->logout()V

    return-void

    .line 146
    :cond_0
    new-instance p1, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;

    invoke-direct {p1}, Landroidx/activity/result/contract/ActivityResultContracts$StartActivityForResult;-><init>()V

    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda2;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda2;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p0, p1, v1}, Lcom/prsocial/app/MainActivity;->registerForActivityResult(Landroidx/activity/result/contract/ActivityResultContract;Landroidx/activity/result/ActivityResultCallback;)Landroidx/activity/result/ActivityResultLauncher;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLauncher:Landroidx/activity/result/ActivityResultLauncher;

    .line 199
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->bindViews()V

    .line 200
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->bindMultiPanel()V

    .line 201
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadDashboard()V

    .line 202
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->loadMe()V

    .line 203
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->checkAllSocialAccounts()V

    .line 204
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    .line 206
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda3;

    invoke-direct {p1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda3;-><init>(Lcom/prsocial/app/MainActivity;)V

    sput-object p1, Lcom/prsocial/app/TaskWebViewActivity;->submitResultCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitResultCallback;

    .line 221
    new-instance p1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda4;

    invoke-direct {p1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda4;-><init>(Lcom/prsocial/app/MainActivity;)V

    sput-object p1, Lcom/prsocial/app/TaskWebViewActivity;->submitStartCallback:Lcom/prsocial/app/TaskWebViewActivity$SubmitStartCallback;

    const/4 p1, 0x0

    .line 224
    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->tvTaskStatus:Landroid/widget/TextView;

    .line 226
    sget p1, Lcom/prsocial/app/R$id;->switch_alert_sound:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroidx/appcompat/widget/SwitchCompat;

    if-eqz p1, :cond_1

    .line 228
    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->sm:Lcom/prsocial/app/SessionManager;

    invoke-virtual {v1}, Lcom/prsocial/app/SessionManager;->isAlertSoundEnabled()Z

    move-result v1

    invoke-virtual {p1, v1}, Landroidx/appcompat/widget/SwitchCompat;->setChecked(Z)V

    .line 229
    new-instance v1, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda5;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda5;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v1}, Landroidx/appcompat/widget/SwitchCompat;->setOnCheckedChangeListener(Landroid/widget/CompoundButton$OnCheckedChangeListener;)V

    .line 236
    :cond_1
    sget p1, Lcom/prsocial/app/R$id;->network_banner:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->networkBanner:Landroid/view/View;

    .line 237
    new-instance p1, Lcom/prsocial/app/NetworkMonitor;

    invoke-direct {p1, p0}, Lcom/prsocial/app/NetworkMonitor;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->networkMonitor:Lcom/prsocial/app/NetworkMonitor;

    .line 239
    new-instance v1, Lcom/prsocial/app/MainActivity$1;

    invoke-direct {v1, p0}, Lcom/prsocial/app/MainActivity$1;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v1}, Lcom/prsocial/app/NetworkMonitor;->start(Lcom/prsocial/app/NetworkMonitor$Listener;)V

    .line 285
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->networkMonitor:Lcom/prsocial/app/NetworkMonitor;

    invoke-virtual {p1}, Lcom/prsocial/app/NetworkMonitor;->isConnected()Z

    move-result p1

    if-nez p1, :cond_2

    .line 286
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->networkBanner:Landroid/view/View;

    if-eqz p1, :cond_2

    const/4 v1, 0x0

    invoke-virtual {p1, v1}, Landroid/view/View;->setVisibility(I)V

    .line 288
    :cond_2
    sget p1, Lcom/prsocial/app/R$id;->task_log_container:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainer:Landroid/widget/LinearLayout;

    .line 289
    sget p1, Lcom/prsocial/app/R$id;->task_log_scroll:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroidx/core/widget/NestedScrollView;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScroll:Landroidx/core/widget/NestedScrollView;

    .line 290
    sget p1, Lcom/prsocial/app/R$id;->task_log_header:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogHeader:Landroid/widget/LinearLayout;

    .line 291
    sget p1, Lcom/prsocial/app/R$id;->task_log_container_tiktok:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTikTok:Landroid/widget/LinearLayout;

    .line 292
    sget p1, Lcom/prsocial/app/R$id;->task_log_scroll_tiktok:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroidx/core/widget/NestedScrollView;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTikTok:Landroidx/core/widget/NestedScrollView;

    .line 293
    sget p1, Lcom/prsocial/app/R$id;->task_log_header_tiktok:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderTikTok:Landroid/widget/LinearLayout;

    .line 294
    sget p1, Lcom/prsocial/app/R$id;->task_log_container_threads:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerThreads:Landroid/widget/LinearLayout;

    .line 295
    sget p1, Lcom/prsocial/app/R$id;->task_log_scroll_threads:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroidx/core/widget/NestedScrollView;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollThreads:Landroidx/core/widget/NestedScrollView;

    .line 296
    sget p1, Lcom/prsocial/app/R$id;->task_log_header_threads:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderThreads:Landroid/widget/LinearLayout;

    .line 297
    sget p1, Lcom/prsocial/app/R$id;->task_log_container_youtube:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerYouTube:Landroid/widget/LinearLayout;

    .line 298
    sget p1, Lcom/prsocial/app/R$id;->task_log_scroll_youtube:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroidx/core/widget/NestedScrollView;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollYouTube:Landroidx/core/widget/NestedScrollView;

    .line 299
    sget p1, Lcom/prsocial/app/R$id;->task_log_header_youtube:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderYouTube:Landroid/widget/LinearLayout;

    .line 300
    sget p1, Lcom/prsocial/app/R$id;->task_log_container_telegram:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogContainerTelegram:Landroid/widget/LinearLayout;

    .line 301
    sget p1, Lcom/prsocial/app/R$id;->task_log_scroll_telegram:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroidx/core/widget/NestedScrollView;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTelegram:Landroidx/core/widget/NestedScrollView;

    .line 302
    sget p1, Lcom/prsocial/app/R$id;->task_log_header_telegram:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/LinearLayout;

    iput-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogHeaderTelegram:Landroid/widget/LinearLayout;

    .line 303
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScroll:Landroidx/core/widget/NestedScrollView;

    if-eqz p1, :cond_3

    invoke-virtual {p1, v0}, Landroidx/core/widget/NestedScrollView;->setNestedScrollingEnabled(Z)V

    .line 304
    :cond_3
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTikTok:Landroidx/core/widget/NestedScrollView;

    if-eqz p1, :cond_4

    invoke-virtual {p1, v0}, Landroidx/core/widget/NestedScrollView;->setNestedScrollingEnabled(Z)V

    .line 305
    :cond_4
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollThreads:Landroidx/core/widget/NestedScrollView;

    if-eqz p1, :cond_5

    invoke-virtual {p1, v0}, Landroidx/core/widget/NestedScrollView;->setNestedScrollingEnabled(Z)V

    .line 306
    :cond_5
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollYouTube:Landroidx/core/widget/NestedScrollView;

    if-eqz p1, :cond_6

    invoke-virtual {p1, v0}, Landroidx/core/widget/NestedScrollView;->setNestedScrollingEnabled(Z)V

    .line 307
    :cond_6
    iget-object p1, p0, Lcom/prsocial/app/MainActivity;->taskLogScrollTelegram:Landroidx/core/widget/NestedScrollView;

    if-eqz p1, :cond_7

    invoke-virtual {p1, v0}, Landroidx/core/widget/NestedScrollView;->setNestedScrollingEnabled(Z)V

    .line 308
    :cond_7
    sget p1, Lcom/prsocial/app/R$id;->tv_log_clear:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    if-eqz p1, :cond_8

    .line 309
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda6;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda6;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 310
    :cond_8
    sget p1, Lcom/prsocial/app/R$id;->tv_log_clear_tiktok:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    if-eqz p1, :cond_9

    .line 311
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda7;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda7;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 312
    :cond_9
    sget p1, Lcom/prsocial/app/R$id;->tv_log_clear_threads:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    if-eqz p1, :cond_a

    .line 313
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda8;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda8;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 314
    :cond_a
    sget p1, Lcom/prsocial/app/R$id;->tv_log_clear_youtube:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    if-eqz p1, :cond_b

    .line 315
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda9;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda9;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 316
    :cond_b
    sget p1, Lcom/prsocial/app/R$id;->tv_log_clear_telegram:I

    invoke-virtual {p0, p1}, Lcom/prsocial/app/MainActivity;->findViewById(I)Landroid/view/View;

    move-result-object p1

    check-cast p1, Landroid/widget/TextView;

    if-eqz p1, :cond_c

    .line 317
    new-instance v0, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda10;

    invoke-direct {v0, p0}, Lcom/prsocial/app/MainActivity$$ExternalSyntheticLambda10;-><init>(Lcom/prsocial/app/MainActivity;)V

    invoke-virtual {p1, v0}, Landroid/widget/TextView;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    .line 320
    :cond_c
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->setupSubscriptionUI()V

    .line 321
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->scheduleSubscriptionCheck()V

    return-void
.end method

.method protected onDestroy()V
    .locals 2

    .line 2033
    invoke-super {p0}, Landroidx/appcompat/app/AppCompatActivity;->onDestroy()V

    .line 2034
    invoke-static {}, Lcom/prsocial/app/AlertSoundManager;->stopAlert()V

    .line 2035
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->networkMonitor:Lcom/prsocial/app/NetworkMonitor;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Lcom/prsocial/app/NetworkMonitor;->stop()V

    .line 2036
    :cond_0
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->subCheckHandler:Landroid/os/Handler;

    iget-object v1, p0, Lcom/prsocial/app/MainActivity;->subCheckRunnable:Ljava/lang/Runnable;

    invoke-virtual {v0, v1}, Landroid/os/Handler;->removeCallbacks(Ljava/lang/Runnable;)V

    .line 2037
    iget-object v0, p0, Lcom/prsocial/app/MainActivity;->subCountdown:Landroid/os/CountDownTimer;

    if-eqz v0, :cond_1

    invoke-virtual {v0}, Landroid/os/CountDownTimer;->cancel()V

    :cond_1
    return-void
.end method

.method protected onResume()V
    .locals 0

    .line 326
    invoke-super {p0}, Landroidx/appcompat/app/AppCompatActivity;->onResume()V

    .line 327
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->applyAutomationBlockStatus()V

    .line 328
    invoke-direct {p0}, Lcom/prsocial/app/MainActivity;->updateTelegramStatusUI()V

    return-void
.end method
