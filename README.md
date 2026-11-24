# Topé

A private, offline Android app for tracking your cannabis use, based on what you buy and, if you want, what you
weigh.

Topé is a tracking tool, not an incentive to use. All stats come from real measurements: nothing is simulated.

## Privacy

- **No internet permission**: the app can't send anything anywhere.
- **Encrypted storage**: data is encrypted with AES-GCM, using a key kept in the Android Keystore.
- **App lock**: the app can require your phone's PIN, pattern or fingerprint.
- **Screenshot protection**: the screen is hidden in the recent-apps view and can't be captured.
- **Encrypted backups**: export and import files protected by a password of your choice.
- **Discreet mode**: swaps the launcher icon and name for a neutral one.

## Features

- **Log purchases** (grams + price) and optional **weigh-ins**, with an optional exact time
- **Real stats only**: usage is only counted between two known stock points (purchase, purchase with leftovers,
  weigh-in). The one projection is clearly labeled: "at this rate, you'll run out in X days".
- 30-day average with its trend, last known stock, monthly spending
- Calendar and charts (long periods are grouped by week)
- Home-screen widgets: estimated stock + stats, or two quick-entry buttons
- Optional weigh-in reminders
- French and English, with an interactive onboarding and a first-launch disclaimer
- A "get help" screen with links to support services
- Material 3 Expressive look, plus Mica and liquid-glass styles, animated shader backgrounds, AMOLED mode and an
  adjustable background pattern
- Cosmetic option to change the name shown for the substance (the data isn't affected)

## Build

### With GitHub Actions

Every push to `main` runs the calculation tests and builds the APK. Open the **Actions** tab, pick the latest
run and download the `Tope` artifact.

By default, each run signs the APK with a new throwaway key, so a new build won't install over the old one
(uninstalling wipes your data, so **export a backup first**). To install updates over the previous version, add
these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `KEYSTORE_BASE64` | your keystore file, base64-encoded (`base64 -w0 your.keystore`) |
| `KS_PASS` | keystore password |
| `KS_ALIAS` | key alias |

### Locally (Debian/Ubuntu, no Gradle)

```sh
sudo apt install aapt apksigner dalvik-exchange android-sdk-platform-23 zipalign
./build.sh
```

The APK lands in `build/Tope.apk`. The first build creates a `tope.keystore` signing key. Keep it private and
reuse it for every build. It's ignored by git.

### Tests

```sh
node test/calc.test.js
```

## Project layout

```
assets/            the UI (HTML/CSS/vanilla JS)
  calc.js          calculation engine: plain JS, no dependencies, tested under Node
  app.js           screens, charts, calendar, onboarding, themes
src/app/tope/      native Android shell (Java): WebView, encrypted storage, app lock, backups,
                   discreet mode, reminders, widgets
test/              calculation tests
icons.py           launcher icon generator
```

Font: Fredoka (SIL Open Font License 1.1, see `assets/fonts/`).
