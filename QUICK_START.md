# Quick Start - Capacitor Migration

## Run This Now!

Open Command Prompt in this folder and run:

```bash
migrate-to-capacitor.bat
```

This will automatically:
1. Install all dependencies
2. Clean old Cordova files
3. Build the web assets
4. Add Android platform
5. Sync Capacitor

## After the Script Completes

### 1. Configure OneSignal (IMPORTANT!)

You need to add your Firebase configuration:

**Download google-services.json:**
- Go to Firebase Console
- Download google-services.json
- Place it here: `android/app/google-services.json`

**Edit android/app/build.gradle:**
Add this line at the top (after other apply plugin lines):
```gradle
apply plugin: 'com.google.gms.google-services'
```

Add to dependencies section:
```gradle
implementation 'com.google.firebase:firebase-messaging:23.1.0'
```

**Edit android/build.gradle:**
Add to dependencies section (inside buildscript):
```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

### 2. Open in Android Studio

```bash
npx cap open android
```

### 3. Build and Test

In Android Studio:
- Click the green play button
- Select your device/emulator
- Wait for build to complete
- Test the app!

## That's It!

Your app is now running on Capacitor instead of Cordova.

## Need Help?

See detailed instructions in:
- `CAPACITOR_MIGRATION.md` - Full migration guide
- `MIGRATION_SUMMARY.md` - What was changed

## Quick Commands

```bash
# Rebuild after code changes
ionic build && npx cap sync

# Open Android Studio
npx cap open android

# Run on device
ionic cap run android

# View logs
npx cap run android -l
```

## Verify Everything Works

Test these features:
- [ ] App launches
- [ ] News loads from WordPress
- [ ] Categories work
- [ ] Live TV plays
- [ ] Favorites save/load
- [ ] Comments post
- [ ] Dark mode toggles
- [ ] Push notifications arrive

## Original App

Your original Cordova app is still safe at:
`C:\Users\USER\OneDrive\Documents\tej-news-app`

You can switch back anytime if needed!
