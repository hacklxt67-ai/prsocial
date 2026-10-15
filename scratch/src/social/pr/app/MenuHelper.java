package social.pr.app;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MenuHelper {

    private static final int COLOR_BG_DARK = Color.parseColor("#090d16");
    private static final int COLOR_BAR_BG = Color.parseColor("#0d131f");
    private static final int COLOR_DIVIDER = Color.parseColor("#1e293b");
    private static final int COLOR_ACTIVE_TAB_BG = Color.parseColor("#1e293b");
    private static final int COLOR_ACTIVE_TEXT = Color.parseColor("#f97316"); // PR.social orange
    private static final int COLOR_INACTIVE_TEXT = Color.parseColor("#94a3b8");

    public static void attach(final Activity activity, final View composeView, final ViewGroup.LayoutParams layoutParams) {
        try {
            // Full screen layout params
            ViewGroup.LayoutParams fullScreenParams = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            );

            // Root layout - fills entire window
            LinearLayout root = new LinearLayout(activity);
            root.setOrientation(LinearLayout.VERTICAL);
            root.setBackgroundColor(COLOR_BG_DARK);
            root.setLayoutParams(fullScreenParams);

            // Top Navigation Bar
            LinearLayout navBar = new LinearLayout(activity);
            navBar.setOrientation(LinearLayout.HORIZONTAL);
            navBar.setBackgroundColor(COLOR_BAR_BG);
            navBar.setGravity(Gravity.CENTER_VERTICAL);
            int barPadH = dpToPx(activity, 8);
            int barPadV = dpToPx(activity, 6);
            navBar.setPadding(barPadH, barPadV, barPadH, barPadV);
            LinearLayout.LayoutParams barParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(activity, 48)
            );
            root.addView(navBar, barParams);

            // Tab 1: Telegram Tasks
            final LinearLayout tabTelegram = createTabItem(activity, "\u26A1 Telegram Tasks");
            // Tab 2: Auto Tasks
            final LinearLayout tabAuto = createTabItem(activity, "\uD83C\uDF10 Auto Tasks");

            LinearLayout.LayoutParams tabParams = new LinearLayout.LayoutParams(
                0, dpToPx(activity, 38), 1.0f
            );
            tabParams.setMargins(dpToPx(activity, 4), 0, dpToPx(activity, 4), 0);

            navBar.addView(tabTelegram, tabParams);
            navBar.addView(tabAuto, tabParams);

            // Divider line below top nav
            View divider = new View(activity);
            divider.setBackgroundColor(COLOR_DIVIDER);
            LinearLayout.LayoutParams divParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(activity, 1)
            );
            root.addView(divider, divParams);

            // Container for both pages (takes 100% of remaining screen height)
            FrameLayout contentContainer = new FrameLayout(activity);
            LinearLayout.LayoutParams containerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1.0f
            );
            root.addView(contentContainer, containerParams);

            // 1. Native Compose View (Telegram Tasks)
            if (composeView.getParent() != null) {
                ((ViewGroup) composeView.getParent()).removeView(composeView);
            }
            FrameLayout.LayoutParams pageParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
            );
            contentContainer.addView(composeView, pageParams);

            // 2. Auto Tasks View (Web Automation) - Lazily loaded on tab switch
            final AutoTasksView[] autoTasksViewHolder = new AutoTasksView[1];

            // Initial state: Telegram tab active
            setTabState(tabTelegram, true);
            setTabState(tabAuto, false);

            tabTelegram.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    composeView.setVisibility(View.VISIBLE);
                    if (autoTasksViewHolder[0] != null) {
                        autoTasksViewHolder[0].setVisibility(View.GONE);
                    }
                    setTabState(tabTelegram, true);
                    setTabState(tabAuto, false);
                }
            });

            tabAuto.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    composeView.setVisibility(View.GONE);
                    if (autoTasksViewHolder[0] == null) {
                        try {
                            AutoTasksView atv = new AutoTasksView(activity);
                            autoTasksViewHolder[0] = atv;
                            contentContainer.addView(atv, pageParams);
                        } catch (Throwable t) {
                            android.util.Log.e("MenuHelper", "Failed to init AutoTasksView", t);
                        }
                    }
                    if (autoTasksViewHolder[0] != null) {
                        autoTasksViewHolder[0].setVisibility(View.VISIBLE);
                        autoTasksViewHolder[0].onShow();
                    }
                    setTabState(tabTelegram, false);
                    setTabState(tabAuto, true);
                }
            });

            // Set root view on activity with MATCH_PARENT
            activity.setContentView(root, fullScreenParams);
        } catch (Throwable t) {
            // Fallback to original content view in case of any unexpected runtime error
            try {
                if (composeView.getParent() != null) {
                    ((ViewGroup) composeView.getParent()).removeView(composeView);
                }
                if (layoutParams != null) {
                    activity.setContentView(composeView, layoutParams);
                } else {
                    activity.setContentView(composeView);
                }
            } catch (Throwable ignored) {}
        }
    }

    private static LinearLayout createTabItem(Context context, String label) {
        LinearLayout tab = new LinearLayout(context);
        tab.setOrientation(LinearLayout.VERTICAL);
        tab.setGravity(Gravity.CENTER);
        tab.setClickable(true);
        tab.setFocusable(true);

        TextView tv = new TextView(context);
        tv.setText(label);
        tv.setTextSize(13f);
        tv.setGravity(Gravity.CENTER);
        tab.addView(tv, new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        return tab;
    }

    private static void setTabState(LinearLayout tab, boolean active) {
        TextView tv = (TextView) tab.getChildAt(0);
        if (active) {
            GradientDrawable gd = new GradientDrawable();
            gd.setColor(COLOR_ACTIVE_TAB_BG);
            gd.setCornerRadius(dpToPx(tab.getContext(), 8));
            gd.setStroke(dpToPx(tab.getContext(), 1), Color.parseColor("#f97316"));
            tab.setBackground(gd);
            tv.setTextColor(COLOR_ACTIVE_TEXT);
            tv.setTypeface(null, Typeface.BOLD);
        } else {
            tab.setBackground(null);
            tv.setTextColor(COLOR_INACTIVE_TEXT);
            tv.setTypeface(null, Typeface.NORMAL);
        }
    }

    private static int dpToPx(Context context, int dp) {
        float density = context.getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }
}
