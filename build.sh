#!/bin/bash
# HKAWN MAI 學中文 — APK Build Script
# Usage: ./build.sh
set -e
export JAVA_HOME=/opt/homebrew/opt/openjdk@21

echo "=== HKAWN MAI Build ==="
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "1. Cleaning www/ ..."
rm -rf www
mkdir -p www/data www/icons

echo "2. Copying web assets ..."
cp prototype.html www/index.html
cp -r audio www/audio
cp -r icons/* www/icons/
cp manifest.json www/
cp service-worker.js www/
cp data/*.js www/data/
cp data/*.json www/data/
cp -r data/reference www/data/

echo "3. Syncing to Android ..."
npx cap sync

echo "4. Building Release APK ..."
cd android && ./gradlew assembleRelease

echo "=== Done! ==="
echo "APK at: android/app/build/outputs/apk/release/app-release.apk"
