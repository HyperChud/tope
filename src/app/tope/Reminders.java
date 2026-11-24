package app.tope;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;

import java.util.Calendar;
import java.util.Random;

/**
 * Weigh-in reminders. A daily alarm (inexact, battery-friendly) at the chosen time checks
 * whether to notify: only if there was no weigh-in and no reminder for N days.
 * Rescheduled when the phone boots and after an app update.
 */
public class Reminders extends BroadcastReceiver {
    static final String ACTION = "app.tope.REMIND";
    private static final String CHANNEL = "pesee";
    private static final long SLACK = 2 * 3600 * 1000L; // 2 h tolerance on the interval

    @Override
    public void onReceive(Context c, Intent intent) {
        String a = intent.getAction();
        if (ACTION.equals(a)) maybeNotify(c);
        else applyLauncher(c);   // boot / update: make sure an icon is visible
        schedule(c);
    }

    /** Only one active launcher entry: Topé, or the discreet icon. */
    static void applyLauncher(Context c) {
        boolean disc = prefs(c).getBoolean("discret", false);
        String pkg = "app.tope.";
        android.content.pm.PackageManager pm = c.getPackageManager();
        String on = disc ? "Discret" : "Launcher", off = disc ? "Launcher" : "Discret";
        try {
            pm.setComponentEnabledSetting(new android.content.ComponentName(c, pkg + on),
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_ENABLED, android.content.pm.PackageManager.DONT_KILL_APP);
            pm.setComponentEnabledSetting(new android.content.ComponentName(c, pkg + off),
                    android.content.pm.PackageManager.COMPONENT_ENABLED_STATE_DISABLED, android.content.pm.PackageManager.DONT_KILL_APP);
        } catch (Exception ignored) { }
    }

    static SharedPreferences prefs(Context c) { return c.getSharedPreferences("tope", Context.MODE_PRIVATE); }

    static void schedule(Context c) {
        SharedPreferences p = prefs(c);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        Intent i = new Intent(c, Reminders.class);
        i.setAction(ACTION);
        PendingIntent pi = PendingIntent.getBroadcast(c, 20, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        if (am == null) return;
        if (!p.getBoolean("rem_on", false)) { am.cancel(pi); return; }
        int h = 20, m = 0;
        try {
            String[] t = p.getString("rem_time", "20:00").split(":");
            h = Integer.parseInt(t[0]); m = Integer.parseInt(t[1]);
        } catch (Exception ignored) { }
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, h);
        cal.set(Calendar.MINUTE, m);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        if (cal.getTimeInMillis() <= System.currentTimeMillis() + 60000) cal.add(Calendar.DAY_OF_YEAR, 1);
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), pi);
    }

    static void maybeNotify(Context c) {
        SharedPreferences p = prefs(c);
        if (!p.getBoolean("rem_on", false)) return;
        int days = Math.max(1, p.getInt("rem_days", 2));
        long period = days * 86400000L - SLACK, now = System.currentTimeMillis();
        if (now - p.getLong("last_pesee_ms", 0) < period) return;   // already weighed recently
        if (now - p.getLong("last_notif_ms", 0) < period) return;   // already reminded recently
        notifyNow(c, days);
        p.edit().putLong("last_notif_ms", now).apply();
    }

    static void notifyNow(Context c, int days) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        SharedPreferences p = prefs(c);
        boolean discret = p.getBoolean("discret", false) || p.getString("widget", "").contains("\"hide\":true");
        String title, text;
        boolean en = Widgets.en(c);
        if (discret) {
            title = en ? "Notebook" : "Carnet";
            text = en ? "Daily reminder." : "Petit rappel du jour.";
        } else {
            String de = en ? "hash" : "de shit";
            try { de = new org.json.JSONObject(p.getString("widget", "{}")).optString("subDe", de); } catch (Exception ignored) { }
            String[][] q = en ? new String[][] {
                {"Weigh me if you can ⚖️", "A quick weigh-in keeps your stats sharp."},
                {"Weigh-in time", "How much " + de + " is left? To the gram."},
                {"The scale is bored", "Nothing on it for " + days + (days > 1 ? " days." : " day.")},
                {"Stash check", "Two seconds on the scale and you’re done."}
            } : new String[][] {
                {"Pèse-moi si tu peux ⚖️", "Une petite pesée pour des stats au poil."},
                {"Pesée du jour", "Combien il te reste " + de + " ? Réponse au gramme près."},
                {"La balance s’ennuie", "Ça fait " + days + (days > 1 ? " jours" : " jour") + " qu’elle n’a rien vu passer."},
                {"Check du stock", "Deux secondes sur la balance, et c’est plié."}
            };
            String[] pick = q[new Random().nextInt(q.length)];
            title = pick[0]; text = pick[1];
        }
        try {
            Notification.Builder b = new Notification.Builder(c);
            if (Build.VERSION.SDK_INT >= 26) {
                // API 26+ called through reflection (the app is compiled against API 23)
                Class<?> cc = Class.forName("android.app.NotificationChannel");
                Object ch = cc.getConstructor(String.class, CharSequence.class, int.class)
                        .newInstance(CHANNEL, en ? "Weigh-in reminders" : "Rappels de pesée", 3 /* IMPORTANCE_DEFAULT */);
                nm.getClass().getMethod("createNotificationChannel", cc).invoke(nm, ch);
                b.getClass().getMethod("setChannelId", String.class).invoke(b, CHANNEL);
            }
            Notification pub = new Notification.Builder(c)
                    .setSmallIcon(R.drawable.ic_notif).setContentTitle(en ? "Notebook" : "Carnet").setContentText(en ? "Reminder" : "Petit rappel").build();
            b.setSmallIcon(R.drawable.ic_notif)
                    .setContentTitle(title)
                    .setContentText(text)
                    .setColor(Color.rgb(47, 106, 63))
                    .setAutoCancel(true)
                    .setCategory(Notification.CATEGORY_REMINDER)
                    .setVisibility(Notification.VISIBILITY_PRIVATE)
                    .setPublicVersion(pub)
                    .setContentIntent(Widgets.open(c, "pesee", 21));
            nm.notify(1, b.build());
        } catch (Exception ignored) { }
    }
}
