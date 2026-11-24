package app.tope;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.util.Base64;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Locale;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Topé's native shell: a WebView showing the bundled UI (assets/),
 * plus a JS bridge for encrypted storage, app lock and backups.
 * The app has no network permission: it can't reach the internet.
 */
public class MainActivity extends Activity {
    private static final int RC_UNLOCK = 1, RC_EXPORT = 2, RC_IMPORT = 3, RC_BG = 4;
    private static final String BG_FILE = "fond.bin";
    private static final String KEY_ALIAS = "tope_data_key";
    private static final String DATA_FILE = "carnet.bin";
    private static final Charset UTF8 = Charset.forName("UTF-8");
    private static final byte[] MAGIC = {'T', 'O', 'P', 'E'};
    private static final int PBKDF2_ITER = 120000;

    private WebView web;
    private SharedPreferences prefs;
    private boolean unlocked = false;
    private boolean externalPending = false;
    private String pendingJson, pendingPwd;
    private final Object fileLock = new Object();
    private static final int RC_NOTIF = 7;
    private String pendingAction;
    private boolean pageLoaded = false;
    private int pendingRemDays = 2;
    private String pendingRemTime = "20:00";
    private int insetTop, insetBottom, insetLeft, insetRight, insetKb;

    /** Edge to edge: the app draws under the status and navigation bars (insets handled by the page). */
    private void edgeToEdge(Window w, boolean light) {
        w.setStatusBarColor(Color.TRANSPARENT);
        w.setNavigationBarColor(Color.TRANSPARENT);
        int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
        if (light) {
            flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            if (Build.VERSION.SDK_INT >= 26) flags |= 0x10; // SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        }
        w.getDecorView().setSystemUiVisibility(flags);
        try { // API 29+: no forced gray scrim behind the navigation bar
            if (Build.VERSION.SDK_INT >= 29) {
                w.getClass().getMethod("setNavigationBarContrastEnforced", boolean.class).invoke(w, false);
                w.getClass().getMethod("setStatusBarContrastEnforced", boolean.class).invoke(w, false);
            }
        } catch (Exception ignored) { }
        try { // API 28+: also use the notch / camera cutout area
            if (Build.VERSION.SDK_INT >= 28) {
                WindowManager.LayoutParams lp = w.getAttributes();
                lp.getClass().getField("layoutInDisplayCutoutMode").setInt(lp, 1); // SHORT_EDGES
                w.setAttributes(lp);
            }
        } catch (Exception ignored) { }
    }

    private void sendInsets() {
        JSONObject o = new JSONObject();
        try {
            o.put("type", "insets"); o.put("top", insetTop); o.put("bottom", insetBottom);
            o.put("left", insetLeft); o.put("right", insetRight); o.put("kb", insetKb);
        } catch (Exception ignored) { }
        sendJs(o);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        prefs = getSharedPreferences("tope", Context.MODE_PRIVATE);
        if (prefs.contains("icon")) { prefs.edit().remove("icon").apply(); applyLauncher(); }   // v3: Cozy/Cyberfunk icons removed
        if (prefs.getBoolean("secure", true))
            w.setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);

        web = new WebView(this);
        // last known background color (chosen theme): no green flash on startup
        int bg0 = prefs.getInt("bg", isNight() ? Color.rgb(17, 20, 17) : Color.rgb(246, 251, 243));
        web.setBackgroundColor(bg0);
        w.getDecorView().setBackgroundColor(bg0);
        edgeToEdge(w, prefs.getBoolean("lightBars", !isNight()));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowContentAccess(false);
        s.setGeolocationEnabled(false);
        s.setSaveFormData(false);
        s.setTextZoom(100);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return !url.startsWith("file:///android_asset/");
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageLoaded = true;
                sendInsets();
                flushAction();
            }
        });
        pendingAction = getIntent() != null ? getIntent().getStringExtra(Widgets.EXTRA_ACTION) : null;
        web.addJavascriptInterface(new Bridge(), "Android");
        if (isLockOn()) web.setVisibility(View.INVISIBLE);
        web.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View v, WindowInsets in) {
                float d = getResources().getDisplayMetrics().density;
                insetTop = Math.round(in.getSystemWindowInsetTop() / d);
                // navigation bar alone (stable) + keyboard separately, so the nav bar doesn't jump above the keyboard
                insetBottom = Math.round(in.getStableInsetBottom() / d);
                insetKb = Math.max(0, Math.round((in.getSystemWindowInsetBottom() - in.getStableInsetBottom()) / d));
                insetLeft = Math.round(in.getSystemWindowInsetLeft() / d);
                insetRight = Math.round(in.getSystemWindowInsetRight() / d);
                if (pageLoaded) sendInsets();
                return in;
            }
        });
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }

    // ------------------------------------------------------------------ app lock
    private boolean isLockOn() { return prefs.getBoolean("lock", false); }

    @Override
    protected void onResume() {
        super.onResume();
        web.resumeTimers();
        web.onResume();
        if (pageLoaded) {   // refresh the stock estimate (time has passed)
            JSONObject o = new JSONObject();
            try { o.put("type", "resume"); } catch (Exception ignored) { }
            sendJs(o);
        }
        if (isLockOn() && !unlocked && !externalPending) requestUnlock();
    }

    @Override
    protected void onPause() {
        // in the background: no animations or timers, zero battery used by the WebView
        web.onPause();
        web.pauseTimers();
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (!externalPending && isLockOn()) {
            unlocked = false;
            web.setVisibility(View.INVISIBLE);
        }
    }

    @SuppressWarnings("deprecation")
    private void requestUnlock() {
        KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
        Intent i = (km != null && km.isKeyguardSecure())
                ? km.createConfirmDeviceCredentialIntent("Topé", Widgets.tr(this, "Déverrouille pour ouvrir ton carnet", "Unlock to open your notebook")) : null;
        if (i == null) { unlocked = true; web.setVisibility(View.VISIBLE); return; }
        externalPending = true;
        startActivityForResult(i, RC_UNLOCK);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        externalPending = false;
        if (requestCode == RC_UNLOCK) {
            if (resultCode == RESULT_OK) { unlocked = true; web.setVisibility(View.VISIBLE); }
            else finish();
            return;
        }
        final Uri uri = (resultCode == RESULT_OK && data != null) ? data.getData() : null;
        if (requestCode == RC_EXPORT) {
            final String json = pendingJson, pwd = pendingPwd;
            pendingJson = null; pendingPwd = null;
            if (uri == null || json == null) { sendJs(event("export", false, Widgets.tr(MainActivity.this, "Export annulé", "Export cancelled"), null)); return; }
            new Thread(new Runnable() { public void run() {
                try {
                    byte[] out = encryptWithPassword(json.getBytes(UTF8), pwd);
                    OutputStream os = getContentResolver().openOutputStream(uri, "wt");
                    if (os == null) throw new Exception("flux");
                    try { os.write(out); } finally { os.close(); }
                    sendJs(event("export", true, null, null));
                } catch (Exception e) {
                    sendJs(event("export", false, Widgets.tr(MainActivity.this, "Échec de l'export", "Export failed"), null));
                }
            }}).start();
        } else if (requestCode == RC_BG) {
            if (uri == null) { sendJs(event("bg", false, Widgets.tr(MainActivity.this, "Aucune image choisie", "No picture picked"), null)); return; }
            new Thread(new Runnable() { public void run() {
                try {
                    byte[] jpg = loadScaledJpeg(uri, 1440);
                    byte[] enc = encryptLocal(jpg);
                    synchronized (fileLock) {
                        FileOutputStream os = new FileOutputStream(new File(getFilesDir(), BG_FILE));
                        try { os.write(enc); } finally { os.close(); }
                    }
                    sendJs(event("bg", true, null, null));
                } catch (Exception e) {
                    sendJs(event("bg", false, Widgets.tr(MainActivity.this, "Image illisible", "Unreadable picture"), null));
                }
            }}).start();
        } else if (requestCode == RC_IMPORT) {
            final String pwd = pendingPwd;
            pendingPwd = null;
            if (uri == null || pwd == null) { sendJs(event("import", false, Widgets.tr(MainActivity.this, "Import annulé", "Import cancelled"), null)); return; }
            new Thread(new Runnable() { public void run() {
                try {
                    InputStream is = getContentResolver().openInputStream(uri);
                    if (is == null) throw new Exception("flux");
                    byte[] raw;
                    try { raw = readAll(is, 20 * 1024 * 1024); } finally { is.close(); }
                    byte[] plain = decryptWithPassword(raw, pwd);
                    sendJs(event("import", true, null, new String(plain, UTF8)));
                } catch (Exception e) {
                    sendJs(event("import", false, Widgets.tr(MainActivity.this, "Mot de passe incorrect ou fichier abîmé", "Wrong password or damaged file"), null));
                }
            }}).start();
        }
    }

    // ------------------------------------------------------------------ launcher icon
    private void applyLauncher() { Reminders.applyLauncher(this); }

    // ------------------------------------------------------------------ widget / notification actions
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        String a = intent.getStringExtra(Widgets.EXTRA_ACTION);
        if (a != null) { pendingAction = a; if (pageLoaded) flushAction(); }
    }

    private void flushAction() {
        if (pendingAction == null) return;
        JSONObject o = new JSONObject();
        try { o.put("type", "action"); o.put("k", pendingAction); } catch (Exception ignored) { }
        pendingAction = null;
        sendJs(o);
    }

    // ------------------------------------------------------------------ reminders
    private void saveRem(boolean on, int days, String time) {
        prefs.edit().putBoolean("rem_on", on).putInt("rem_days", days).putString("rem_time", time).apply();
        Reminders.schedule(this);
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        if (code != RC_NOTIF) return;
        boolean ok = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
        saveRem(ok, pendingRemDays, pendingRemTime);
        sendJs(event("notifperm", ok, null, null));
    }

    // ------------------------------------------------------------------ back button / config
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onBack ? window.onBack() : false", new ValueCallback<String>() {
            public void onReceiveValue(String v) {
                if (!"true".equals(v)) finish();
            }
        });
    }

    @Override
    public void onConfigurationChanged(Configuration c) {
        super.onConfigurationChanged(c);
        JSONObject o = new JSONObject();
        try { o.put("type", "resume"); } catch (Exception ignored) { }
        sendJs(o);
    }

    private boolean isNight() {
        return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
    }

    private JSONObject event(String type, boolean ok, String msg, String data) {
        JSONObject o = new JSONObject();
        try {
            o.put("type", type);
            o.put("ok", ok);
            if (msg != null) o.put("msg", msg);
            if (data != null) o.put("data", data);
        } catch (Exception ignored) { }
        return o;
    }

    private void sendJs(final JSONObject o) {
        runOnUiThread(new Runnable() { public void run() {
            String js = o.toString().replace("\u2028", "\\u2028").replace("\u2029", "\\u2029");
            web.evaluateJavascript("window.onNative && window.onNative(" + js + ")", null);
        }});
    }

    // ------------------------------------------------------------------ local encryption (Keystore)
    private SecretKey dataKey() throws Exception {
        KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
        ks.load(null);
        if (!ks.containsAlias(KEY_ALIAS)) {
            KeyGenerator kg = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
            kg.init(new KeyGenParameterSpec.Builder(KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .setKeySize(256)
                    .build());
            kg.generateKey();
        }
        return (SecretKey) ks.getKey(KEY_ALIAS, null);
    }

    private byte[] encryptLocal(byte[] plain) throws Exception {
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.ENCRYPT_MODE, dataKey());
        byte[] iv = c.getIV(), ct = c.doFinal(plain);
        byte[] out = new byte[2 + iv.length + ct.length];
        out[0] = 1; out[1] = (byte) iv.length;
        System.arraycopy(iv, 0, out, 2, iv.length);
        System.arraycopy(ct, 0, out, 2 + iv.length, ct.length);
        return out;
    }

    private byte[] decryptLocal(byte[] in) throws Exception {
        if (in.length < 3 || in[0] != 1) throw new Exception("format");
        int ivLen = in[1] & 0xff;
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.DECRYPT_MODE, dataKey(), new GCMParameterSpec(128, Arrays.copyOfRange(in, 2, 2 + ivLen)));
        return c.doFinal(in, 2 + ivLen, in.length - 2 - ivLen);
    }

    // ------------------------------------------------------------------ password encryption (backups)
    private static SecretKeySpec pwdKey(String pwd, byte[] salt) throws Exception {
        SecretKeyFactory f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] k = f.generateSecret(new PBEKeySpec(pwd.toCharArray(), salt, PBKDF2_ITER, 256)).getEncoded();
        return new SecretKeySpec(k, "AES");
    }

    static byte[] encryptWithPassword(byte[] plain, String pwd) throws Exception {
        SecureRandom r = new SecureRandom();
        byte[] salt = new byte[16], iv = new byte[12];
        r.nextBytes(salt); r.nextBytes(iv);
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.ENCRYPT_MODE, pwdKey(pwd, salt), new GCMParameterSpec(128, iv));
        byte[] ct = c.doFinal(plain);
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        bo.write(MAGIC); bo.write(1); bo.write(salt); bo.write(iv); bo.write(ct);
        return bo.toByteArray();
    }

    static byte[] decryptWithPassword(byte[] in, String pwd) throws Exception {
        if (in.length < 4 + 1 + 16 + 12 + 16) throw new Exception("court");
        for (int i = 0; i < 4; i++) if (in[i] != MAGIC[i]) throw new Exception("magic");
        if (in[4] != 1) throw new Exception("version");
        byte[] salt = Arrays.copyOfRange(in, 5, 21), iv = Arrays.copyOfRange(in, 21, 33);
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.DECRYPT_MODE, pwdKey(pwd, salt), new GCMParameterSpec(128, iv));
        return c.doFinal(in, 33, in.length - 33);
    }

    /** Reads an image, downscales it (longest side = maxDim), fixes EXIF orientation and re-encodes it as JPEG. */
    private byte[] loadScaledJpeg(Uri uri, int maxDim) throws Exception {
        BitmapFactory.Options o = new BitmapFactory.Options();
        o.inJustDecodeBounds = true;
        InputStream is = getContentResolver().openInputStream(uri);
        try { BitmapFactory.decodeStream(is, null, o); } finally { if (is != null) is.close(); }
        if (o.outWidth <= 0 || o.outHeight <= 0) throw new Exception("pas une image");
        int sample = 1;
        while (Math.max(o.outWidth, o.outHeight) / (sample * 2) >= maxDim) sample *= 2;
        BitmapFactory.Options o2 = new BitmapFactory.Options();
        o2.inSampleSize = sample;
        is = getContentResolver().openInputStream(uri);
        Bitmap bmp;
        try { bmp = BitmapFactory.decodeStream(is, null, o2); } finally { if (is != null) is.close(); }
        if (bmp == null) throw new Exception("décodage");
        int rot = 0;
        if (Build.VERSION.SDK_INT >= 24) {
            InputStream es = getContentResolver().openInputStream(uri);
            try {
                Object exif = Class.forName("android.media.ExifInterface").getConstructor(InputStream.class).newInstance(es);
                int ori = (Integer) exif.getClass().getMethod("getAttributeInt", String.class, int.class).invoke(exif, "Orientation", 1);
                rot = ori == 6 ? 90 : ori == 3 ? 180 : ori == 8 ? 270 : 0;
            } catch (Exception ignored) {
            } finally { if (es != null) es.close(); }
        }
        float k = Math.min(1f, (float) maxDim / Math.max(bmp.getWidth(), bmp.getHeight()));
        if (k < 1f || rot != 0) {
            Matrix m = new Matrix();
            m.postScale(k, k);
            m.postRotate(rot);
            Bitmap b2 = Bitmap.createBitmap(bmp, 0, 0, bmp.getWidth(), bmp.getHeight(), m, true);
            if (b2 != bmp) bmp.recycle();
            bmp = b2;
        }
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, 84, bo);
        bmp.recycle();
        return bo.toByteArray();
    }

    private static byte[] readAll(InputStream is, int max) throws Exception {
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        byte[] buf = new byte[8192];
        int n;
        while ((n = is.read(buf)) > 0) {
            bo.write(buf, 0, n);
            if (bo.size() > max) throw new Exception("trop gros");
        }
        return bo.toByteArray();
    }

    // ------------------------------------------------------------------ JS bridge
    private class Bridge {
        @JavascriptInterface
        public String load() {
            synchronized (fileLock) {
                File f = new File(getFilesDir(), DATA_FILE);
                if (!f.exists()) return "";
                try {
                    FileInputStream is = new FileInputStream(f);
                    byte[] raw;
                    try { raw = readAll(is, 50 * 1024 * 1024); } finally { is.close(); }
                    return new String(decryptLocal(raw), UTF8);
                } catch (Exception e) {
                    // Nothing gets destroyed: the unreadable file is set aside.
                    f.renameTo(new File(getFilesDir(), DATA_FILE + ".illisible-" + System.currentTimeMillis()));
                    return "";
                }
            }
        }

        @JavascriptInterface
        public boolean save(String json) {
            synchronized (fileLock) {
                try {
                    byte[] out = encryptLocal(json.getBytes(UTF8));
                    File tmp = new File(getFilesDir(), DATA_FILE + ".tmp");
                    FileOutputStream os = new FileOutputStream(tmp);
                    try { os.write(out); os.getFD().sync(); } finally { os.close(); }
                    return tmp.renameTo(new File(getFilesDir(), DATA_FILE));
                } catch (Exception e) {
                    return false;
                }
            }
        }

        @JavascriptInterface
        public String getColors() {
            if (Build.VERSION.SDK_INT < 31) return "";
            try {
                Resources res = getResources();
                String[][] groups = {{"accent1", "a1"}, {"accent2", "a2"}, {"accent3", "a3"}, {"neutral1", "n1"}, {"neutral2", "n2"}};
                int[] shades = {0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000};
                JSONObject o = new JSONObject();
                for (String[] g : groups) {
                    for (int sh : shades) {
                        int id = res.getIdentifier("system_" + g[0] + "_" + sh, "color", "android");
                        if (id == 0) return "";
                        int col = res.getColor(id, null);
                        o.put(g[1] + "_" + sh, String.format(Locale.ROOT, "#%06X", col & 0xFFFFFF));
                    }
                }
                return o.toString();
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public boolean isNight() { return MainActivity.this.isNight(); }

        @JavascriptInterface
        public void setBars(final String surface, final String low, final boolean light) {
            runOnUiThread(new Runnable() { public void run() {
                try {
                    int c = Color.parseColor(surface);
                    web.setBackgroundColor(c);
                    getWindow().getDecorView().setBackgroundColor(c);
                    prefs.edit().putInt("bg", c).putBoolean("lightBars", light).apply();
                    edgeToEdge(getWindow(), light);
                } catch (Exception ignored) { }
            }});
        }

        @JavascriptInterface
        public boolean isSecure() { return prefs.getBoolean("secure", true); }

        @JavascriptInterface
        public void setSecure(final boolean on) {
            prefs.edit().putBoolean("secure", on).apply();
            runOnUiThread(new Runnable() { public void run() {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
            }});
        }

        @JavascriptInterface
        public boolean isLock() { return isLockOn(); }

        @JavascriptInterface
        public boolean setLock(boolean on) {
            KeyguardManager km = (KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
            if (on && (km == null || !km.isKeyguardSecure())) return false;
            prefs.edit().putBoolean("lock", on).apply();
            if (on) unlocked = true;
            return true;
        }

        @JavascriptInterface
        public boolean isDiscreet() { return prefs.getBoolean("discret", false); }

        @JavascriptInterface
        public void setDiscreet(boolean on) {
            prefs.edit().putBoolean("discret", on).apply();
            applyLauncher();
        }

        @JavascriptInterface
        public void exportData(final String json, final String pwd) {
            runOnUiThread(new Runnable() { public void run() {
                pendingJson = json; pendingPwd = pwd;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("application/octet-stream");
                String day = new SimpleDateFormat("yyyy-MM-dd", Locale.ROOT).format(new Date());
                i.putExtra(Intent.EXTRA_TITLE, Widgets.tr(MainActivity.this, "tope-sauvegarde-", "tope-backup-") + day + ".tope");
                externalPending = true;
                try { startActivityForResult(i, RC_EXPORT); }
                catch (Exception e) { externalPending = false; sendJs(event("export", false, Widgets.tr(MainActivity.this, "Pas de gestionnaire de fichiers", "No file manager"), null)); }
            }});
        }

        @JavascriptInterface
        public String getReminder() {
            JSONObject o = new JSONObject();
            try {
                o.put("on", prefs.getBoolean("rem_on", false));
                o.put("days", prefs.getInt("rem_days", 2));
                o.put("time", prefs.getString("rem_time", "20:00"));
            } catch (Exception ignored) { }
            return o.toString();
        }

        @JavascriptInterface
        public String setReminder(boolean on, int days, String time) {
            if (days < 1) days = 1;
            if (time == null || !time.matches("\\d{2}:\\d{2}")) time = "20:00";
            if (on && Build.VERSION.SDK_INT >= 33
                    && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != PackageManager.PERMISSION_GRANTED) {
                pendingRemDays = days; pendingRemTime = time;
                runOnUiThread(new Runnable() { public void run() {
                    requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, RC_NOTIF);
                }});
                return "asking";
            }
            saveRem(on, days, time);
            return "ok";
        }

        /** Opens the dialer (tel:) or the browser (https:): the app itself has no internet access. */
        @JavascriptInterface
        public boolean openLink(String url) {
            if (url == null || !(url.startsWith("tel:") || url.startsWith("https://"))) return false;
            try {
                Intent i = new Intent(url.startsWith("tel:") ? Intent.ACTION_DIAL : Intent.ACTION_VIEW, android.net.Uri.parse(url));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(i);
                return true;
            } catch (Exception e) { return false; }
        }

        @JavascriptInterface
        public void setLang(String lang) {
            String l = "en".equals(lang) ? "en" : "fr";
            if (l.equals(prefs.getString("lang", "fr"))) return;
            prefs.edit().putString("lang", l).apply();
            Widgets.updateAll(MainActivity.this);
        }

        @JavascriptInterface
        public void updateWidget(String json) {
            SharedPreferences.Editor e = prefs.edit().putString("widget", json);
            try {
                String lp = new JSONObject(json).optString("lastPesee", "");
                if (lp.length() >= 16) {
                    Date d = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm", Locale.ROOT).parse(lp.substring(0, 16));
                    if (d != null) e.putLong("last_pesee_ms", d.getTime());
                }
            } catch (Exception ignored) { }
            e.apply();
            Widgets.updateAll(MainActivity.this);
        }

        @JavascriptInterface
        public void pickBackground() {
            runOnUiThread(new Runnable() { public void run() {
                Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                externalPending = true;
                try { startActivityForResult(i, RC_BG); }
                catch (Exception e) { externalPending = false; sendJs(event("bg", false, Widgets.tr(MainActivity.this, "Pas de sélecteur d'images", "No picture picker"), null)); }
            }});
        }

        @JavascriptInterface
        public String getBackground() {
            synchronized (fileLock) {
                File f = new File(getFilesDir(), BG_FILE);
                if (!f.exists()) return "";
                try {
                    FileInputStream is = new FileInputStream(f);
                    byte[] raw;
                    try { raw = readAll(is, 30 * 1024 * 1024); } finally { is.close(); }
                    return "data:image/jpeg;base64," + Base64.encodeToString(decryptLocal(raw), Base64.NO_WRAP);
                } catch (Exception e) {
                    return "";
                }
            }
        }

        @JavascriptInterface
        public void importData(final String pwd) {
            runOnUiThread(new Runnable() { public void run() {
                pendingPwd = pwd;
                Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("*/*");
                externalPending = true;
                try { startActivityForResult(i, RC_IMPORT); }
                catch (Exception e) { externalPending = false; sendJs(event("import", false, Widgets.tr(MainActivity.this, "Pas de gestionnaire de fichiers", "No file manager"), null)); }
            }});
        }
    }
}
