# Build APK for Testing

## Your app is ready to build! Here are 3 ways to create an APK:

---

## Method 1: Android Studio (Easiest - Recommended)

### Steps:

1. **Open Android Studio**
   ```bash
   npx cap open android
   ```

2. **Wait for Gradle Sync**
   - Android Studio will sync automatically
   - Wait for "Gradle sync finished" message
   - This may take 2-5 minutes first time

3. **Build APK**
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for build to complete (1-3 minutes)
   - You'll see notification: "APK(s) generated successfully"

4. **Locate APK**
   - Click **locate** in the notification
   - Or go to: `android\app\build\outputs\apk\debug\`
   - File: **app-debug.apk**

5. **Install on Device**
   - Copy APK to your phone
   - Open file on phone
   - Tap "Install"
   - Allow "Install from unknown sources" if prompted

---

## Method 2: Command Line (If Gradle works)

### Steps:

1. **Navigate to android folder**
   ```bash
   cd C:\Users\USER\OneDrive\Documents\tej-news-app-cap\android
   ```

2. **Build APK**
   ```bash
   gradlew.bat assembleDebug
   ```

3. **Find APK**
   - Location: `app\build\outputs\apk\debug\app-debug.apk`

---

## Method 3: Ionic CLI (Alternative)

### Steps:

1. **Build and copy**
   ```bash
   ionic build
   npx cap copy android
   ```

2. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

3. **Follow Method 1 steps 3-5**

---

## Installing APK on Your Phone

### Option A: USB Transfer

1. **Connect phone to computer** via USB
2. **Copy app-debug.apk** to phone's Downloads folder
3. **On phone**: Open Files app → Downloads
4. **Tap app-debug.apk**
5. **Tap Install**
6. **Allow installation** from unknown sources if prompted

### Option B: Cloud Transfer

1. **Upload APK** to Google Drive / Dropbox
2. **On phone**: Download APK from cloud
3. **Tap to install**

### Option C: Direct Install (If phone connected)

In Android Studio:
1. **Connect phone via USB**
2. **Enable USB Debugging** on phone
3. **Click green play button** (▶) in Android Studio
4. **Select your device**
5. **App installs and runs automatically**

---

## APK Location

After building, your APK will be at:

```
C:\Users\USER\OneDrive\Documents\tej-news-app-cap\android\app\build\outputs\apk\debug\app-debug.apk
```

**File size**: ~15-25 MB

---

## Testing Checklist

After installing, test these features:

- [ ] App launches successfully
- [ ] News articles load
- [ ] Categories work
- [ ] Live TV page loads
- [ ] Favorites can be saved
- [ ] Comments can be posted
- [ ] Dark mode toggles
- [ ] Push notifications work (after publishing WordPress post)

---

## Troubleshooting

### "App not installed" error
- **Solution**: Uninstall old version first, then reinstall

### "Install blocked" message
- **Solution**: Settings → Security → Allow installation from unknown sources

### APK not found
- **Solution**: Check build completed successfully in Android Studio

### Gradle sync failed
- **Solution**: 
  1. File → Invalidate Caches / Restart
  2. Or delete `android\.gradle` folder
  3. Sync again

---

## Build Release APK (For Production)

When ready to publish to Play Store:

1. **In Android Studio**: Build → Generate Signed Bundle/APK
2. **Choose**: APK
3. **Select keystore**: `tej-news-release-key.keystore`
4. **Enter password**
5. **Build type**: release
6. **APK location**: `app\build\outputs\apk\release\app-release.apk`

---

## Quick Start

**Fastest way to get APK:**

1. Open Command Prompt
2. Run:
   ```bash
   cd C:\Users\USER\OneDrive\Documents\tej-news-app-cap
   npx cap open android
   ```
3. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
4. Wait for build
5. Click "locate" to find APK
6. Copy to phone and install

**That's it!** 🚀
