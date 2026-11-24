package app.tope;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;

/** "Quick buttons" widget: log a purchase / weigh-in, no numbers shown. */
public class QuickWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        m.updateAppWidget(ids, build(c));
    }

    static RemoteViews build(Context c) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_quick);
        Widgets.buttons(c, v, Widgets.summary(c));
        return v;
    }
}
