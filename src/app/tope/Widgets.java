package app.tope;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.text.NumberFormat;
import java.util.Locale;

/** Helpers shared by both widgets: reading the summary pushed by the app, colors, clicks. */
final class Widgets {
    private Widgets() { }

    static final String EXTRA_ACTION = "app.tope.ACTION";

    /** Language picked in the app (pushed via Android.setLang), French by default. */
    static boolean en(Context c) {
        return "en".equals(c.getSharedPreferences("tope", Context.MODE_PRIVATE).getString("lang", "fr"));
    }

    static String tr(Context c, String fr, String en) { return en(c) ? en : fr; }

    private static Locale loc(Context c) { return en(c) ? Locale.UK : Locale.FRANCE; }

    static JSONObject summary(Context c) {
        SharedPreferences p = c.getSharedPreferences("tope", Context.MODE_PRIVATE);
        try { return new JSONObject(p.getString("widget", "{}")); } catch (Exception e) { return new JSONObject(); }
    }

    static int color(JSONObject s, String key, int def) {
        try {
            JSONObject c = s.optJSONObject("c");
            if (c == null || !c.has(key)) return def;
            return Color.parseColor(c.getString(key));
        } catch (Exception e) { return def; }
    }

    static PendingIntent open(Context c, String action, int req) {
        Intent i = new Intent(c, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (action != null) i.putExtra(EXTRA_ACTION, action);
        i.setAction("tope." + (action == null ? "open" : action));
        return PendingIntent.getActivity(c, req, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Purchase / weigh-in buttons shared by both layouts. */
    static void buttons(Context c, RemoteViews v, JSONObject s) {
        v.setInt(R.id.w_btn_achat_bg, "setColorFilter", color(s, "acc", Color.rgb(47, 106, 63)));
        v.setTextColor(R.id.w_btn_achat_tx, color(s, "onAcc", Color.WHITE));
        v.setInt(R.id.w_btn_pesee_bg, "setColorFilter", color(s, "ton", Color.rgb(210, 232, 211)));
        v.setTextColor(R.id.w_btn_pesee_tx, color(s, "onTon", Color.rgb(13, 31, 19)));
        v.setTextViewText(R.id.w_btn_achat_tx, tr(c, "J’ai topé", "Scored"));
        v.setTextViewText(R.id.w_btn_pesee_tx, tr(c, "Pesée", "Weigh"));
        v.setOnClickPendingIntent(R.id.w_btn_achat, open(c, "achat", 11));
        v.setOnClickPendingIntent(R.id.w_btn_pesee, open(c, "pesee", 12));
    }

    static String grams(Context c, double g) {
        NumberFormat f = NumberFormat.getNumberInstance(loc(c));
        f.setMaximumFractionDigits(g >= 100 ? 0 : 1);
        f.setMinimumFractionDigits(0);
        return f.format(g);
    }

    static String grams2(Context c, double g) {
        NumberFormat f = NumberFormat.getNumberInstance(loc(c));
        f.setMaximumFractionDigits(2);
        return f.format(g);
    }

    static String euros(Context c, double e) {
        NumberFormat f = NumberFormat.getNumberInstance(loc(c));
        f.setMaximumFractionDigits(e >= 100 ? 0 : 2);
        f.setMinimumFractionDigits(e >= 100 ? 0 : 2);
        return f.format(e);
    }

    /** Updates every placed widget (called when the app pushes a new summary). */
    static void updateAll(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] a = m.getAppWidgetIds(new ComponentName(c, TopeWidget.class));
        if (a != null && a.length > 0) m.updateAppWidget(a, TopeWidget.build(c));
        int[] b = m.getAppWidgetIds(new ComponentName(c, QuickWidget.class));
        if (b != null && b.length > 0) m.updateAppWidget(b, QuickWidget.build(c));
    }
}
