#!/bin/bash
# Build without Gradle: aapt + javac + dx + zipalign + apksigner
#   Debian/Ubuntu: sudo apt install aapt apksigner dalvik-exchange android-sdk-platform-23 zipalign
#   ./build.sh  ->  build/Tope.apk
#
# Signing: uses the keystore at $KEYSTORE (default: tope.keystore).
# If it doesn't exist, a new one is generated. Keep that file private and reuse it:
# Android only installs an update if it's signed with the same key
# (otherwise you'd have to uninstall, which wipes the app's data).
# Never commit it (it's in .gitignore).
set -euo pipefail
cd "$(dirname "$0")"
SDK=/usr/lib/android-sdk
AJAR=$(ls $SDK/platforms/*/android.jar | head -1)
BT=$(ls -d $SDK/build-tools/*/ | head -1)
KEYSTORE=${KEYSTORE:-tope.keystore}
KS_PASS=${KS_PASS:-topetope}
KS_ALIAS=${KS_ALIAS:-tope}
OUT=build/tope
NAME=Tope

rm -rf "$OUT" && mkdir -p "$OUT/gen" "$OUT/obj" "$OUT/assets"
cp -r assets/. "$OUT/assets/"
aapt package -f -m -J "$OUT/gen" --custom-package app.tope -M AndroidManifest.xml -S res -I "$AJAR"
javac -nowarn -Xlint:-options --release 8 -encoding UTF-8 -cp "$AJAR" -d "$OUT/obj" $(find src "$OUT/gen" -name '*.java')
if [ -x "$BT/dx" ]; then DX="$BT/dx"; else DX=dalvik-exchange; fi
"$DX" --dex --min-sdk-version=23 --output="$OUT/classes.dex" "$OUT/obj"
aapt package -f -M AndroidManifest.xml -S res -A "$OUT/assets" -I "$AJAR" -F "$OUT/unsigned.apk"
(cd "$OUT" && aapt add unsigned.apk classes.dex >/dev/null)
zipalign -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"
[ -f "$KEYSTORE" ] || keytool -genkeypair -keystore "$KEYSTORE" -alias "$KS_ALIAS" -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "$KS_PASS" -keypass "$KS_PASS" -dname "CN=Tope" >/dev/null 2>&1
apksigner sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --ks-key-alias "$KS_ALIAS" --out "build/$NAME.apk" "$OUT/aligned.apk"
apksigner verify "build/$NAME.apk" && ls -la "build/$NAME.apk"
