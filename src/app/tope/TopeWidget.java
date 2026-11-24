package app.tope;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.graphics.Color;
import android.widget.RemoteViews;

import org.json.JSONObject;

/** "Stock and stats" widget: estimated stock recomputed on the spot, average, two buttons. */
public class TopeWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        m.updateAppWidget(ids, build(c));
    }

    private static String label(Context c, JSONObject s) {
        String de = s.optString("subDe", Widgets.tr(c, "de shit", "hash"));
        if (!Widgets.en(c)) return "Stock " + de;
        return (de.length() > 0 ? de.substring(0, 1).toUpperCase(java.util.Locale.UK) + de.substring(1) : de) + " stash";
    }

    static RemoteViews build(Context c) {
        JSONObject s = Widgets.summary(c);
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_stats);
        int fg = Widgets.color(s, "onHero", Color.rgb(0, 33, 11));
        int sub = Widgets.color(s, "onHero", Color.rgb(65, 73, 63));
        v.setInt(R.id.w_bg, "setColorFilter", Widgets.color(s, "hero", Color.rgb(178, 241, 187)));
        v.setTextColor(R.id.w_stock, fg);
        v.setTextColor(R.id.w_label, sub);
        v.setTextColor(R.id.w_line, sub);
        v.setOnClickPendingIntent(R.id.w_root, Widgets.open(c, null, 10));
        Widgets.buttons(c, v, s);

        if (s.optBoolean("hide", false)) {
            v.setTextViewText(R.id.w_label, Widgets.tr(c, "Carnet", "Notebook"));
            v.setTextViewText(R.id.w_stock, "• • •");
            v.setTextViewText(R.id.w_line, "Top secret.");
            return v;
        }
        if (!s.has("stock") || s.optBoolean("empty", true)) {
            v.setTextViewText(R.id.w_label, label(c, s));
            v.setTextViewText(R.id.w_stock, "0 g");
            v.setTextViewText(R.id.w_line, Widgets.tr(c, "Premier achat ? Appuie sur J’ai topé.", "First buy? Tap Scored."));
            return v;
        }
        double stock = s.optDouble("stock", 0);
        double rate = s.optDouble("rate", Double.NaN);
        boolean notEnough = s.optBoolean("notEnough", true);
        long at = s.optLong("at", System.currentTimeMillis());
        // the stock keeps going down at the recent rate between app launches
        if (!notEnough && !Double.isNaN(rate) && rate > 0) {
            double days = Math.max(0, (System.currentTimeMillis() - at) / 86400000.0);
            stock = Math.max(0, stock - rate * days);
        }
        v.setTextViewText(R.id.w_label, label(c, s));
        v.setTextViewText(R.id.w_stock, Widgets.grams(c, stock) + " g");
        String line;
        if (notEnough) line = Widgets.tr(c, "Estimation dès le 2ᵉ achat", "Estimate from your 2nd buy");
        else {
            double avg = s.optDouble("avg30", Double.NaN);
            line = (Double.isNaN(avg) ? "" : Widgets.grams2(c, avg) + Widgets.tr(c, " g/j · ", " g/day · ")) + Widgets.euros(c, s.optDouble("month", 0)) + Widgets.tr(c, " € ce mois", " € this month");
            String rup = s.optString("rupture", "");
            if (stock <= 0.05) line = Widgets.tr(c, "À sec. Une pesée pour vérifier ?", "Out. Weigh to check?");
            else if (rup.length() > 0 && !"null".equals(rup)) line += Widgets.tr(c, "\nÀ ce rythme : vide vers ", "\nAt this pace: out around ") + rup.replace(".", "");
            else if (s.has("daysLeft") && !s.isNull("daysLeft") && s.optDouble("daysLeft", 1) <= 0) line += Widgets.tr(c, "\nÀ ce rythme, déjà vide ?", "\nAt this pace, already out?");
        }
        v.setTextViewText(R.id.w_line, line);
        return v;
    }
}
