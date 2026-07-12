# TEJ News App - Capacitor Migration

This is the Capacitor version of the TEJ News app. The migration from Cordova to Capacitor has been prepared.

## Migration Steps

### 1. Install Dependencies
```bash
cd C:\Users\USER\OneDrive\Documents\tej-news-app-cap
npm install
```

### 2. Delete Old Cordova Files
Delete these files/folders:
- `config.xml` (already replaced with capacitor.config.ts)
- `plugins/` folder
- `www/` folder (will be regenerated)

### 3. Build the Web Assets
```bash
ionic build
```

### 4. Add Android Platform
```bash
npx cap add android
```

### 5. Sync Capacitor
```bash
npx cap sync
```

### 6. Configure OneSignal for Capacitor

#### Add google-services.json
1. Download `google-services.json` from Firebase Console
2. Place it in: `android/app/google-services.json`

#### Update android/app/build.gradle
Add at the top after other plugins:
```gradle
apply plugin: 'com.google.gms.google-services'
```

Add to dependencies section:
```gradle
implementation 'com.google.firebase:firebase-messaging:23.1.0'
```

#### Update android/build.gradle
Add to dependencies section:
```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

#### Update AndroidManifest.xml
Location: `android/app/src/main/AndroidManifest.xml`

Add inside `<application>` tag:
```xml
<meta-data
    android:name="com.onesignal.NotificationOpened.DEFAULT"
    android:value="DISABLE" />
```

### 7. Copy App Icons and Splash Screens

#### Option A: Manual Copy
Copy from `resources/android/icon/` to `android/app/src/main/res/`
Copy from `resources/android/splash/` to `android/app/src/main/res/`

#### Option B: Use Capacitor Assets (Recommended)
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --android
```

### 8. Open in Android Studio
```bash
npx cap open android
```

### 9. Build and Test
In Android Studio:
- Build → Make Project
- Run on emulator or device
- Test all features:
  - News loading
  - Categories
  - Live TV
  - Favorites
  - Comments
  - OneSignal notifications

### 10. Build Release APK
In Android Studio:
1. Build → Generate Signed Bundle/APK
2. Choose APK
3. Select keystore: `tej-news-release-key.keystore`
4. Enter keystore password
5. Build release variant

## Key Changes Made

### Files Modified:
1. **package.json** - Removed Cordova deps, added Capacitor packages
2. **capacitor.config.ts** - New Capacitor configuration
3. **app.component.ts** - Updated to use Capacitor StatusBar and SplashScreen
4. **notification.service.ts** - Changed platform check from 'cordova' to 'capacitor'

### Files to Delete:
- config.xml (replaced by capacitor.config.ts)
- plugins/ folder
- Old www/ build files

### What Stays the Same:
- All Angular/TypeScript code
- All services (news.service.ts, etc.)
- All components and pages
- All HTML templates
- All SCSS styles
- WordPress API integration
- App logic

## Capacitor vs Cordova

| Feature | Cordova | Capacitor |
|---------|---------|-----------|
| Platform Check | `platform.is('cordova')` | `platform.is('capacitor')` |
| Config File | config.xml | capacitor.config.ts |
| Native Projects | Generated | Source controlled |
| Plugin Management | CLI | npm |
| Development | `ionic cordova run` | `ionic cap run` |

## Useful Commands

```bash
# Sync after code changes
npx cap sync

# Open in Android Studio
npx cap open android

# Run on device
ionic cap run android

# Build web assets
ionic build

# Copy web assets to native
npx cap copy

# Update native plugins
npx cap update
```

## Troubleshooting

### White Screen on Launch
- Ensure `ionic build` was run
- Check `webDir: 'www'` in capacitor.config.ts
- Run `npx cap sync`

### OneSignal Not Working
- Verify google-services.json is in place
- Check AndroidManifest.xml has OneSignal meta-data
- Verify App ID: c1b98255-4be3-49f2-b270-371739e46e44

### HTTP Requests Failing
- Add to AndroidManifest.xml: `android:usesCleartextTraffic="true"`
- Or ensure all URLs use HTTPS

### Build Errors
- Clean build: Build → Clean Project in Android Studio
- Invalidate caches: File → Invalidate Caches / Restart
- Delete `android/.gradle` folder and rebuild

## Next Steps

After successful migration:
1. Test thoroughly on multiple devices
2. Compare performance with Cordova version
3. Update app in Play Store
4. Archive old Cordova version
5. Use Capacitor for future development

## Support

For issues, check:
- Capacitor docs: https://capacitorjs.com/docs
- Ionic docs: https://ionicframework.com/docs
- OneSignal Capacitor: https://documentation.onesignal.com/docs/ionic-sdk-setup
