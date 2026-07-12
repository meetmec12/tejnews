@echo off
echo ========================================
echo TEJ News App - Capacitor Migration
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies!
    pause
    exit /b 1
)
echo.

echo Step 2: Cleaning old Cordova files...
if exist "config.xml" del "config.xml"
if exist "plugins" rmdir /s /q "plugins"
echo.

echo Step 3: Building web assets...
call ionic build
if %errorlevel% neq 0 (
    echo Error building web assets!
    pause
    exit /b 1
)
echo.

echo Step 4: Adding Android platform...
call npx cap add android
if %errorlevel% neq 0 (
    echo Error adding Android platform!
    pause
    exit /b 1
)
echo.

echo Step 5: Syncing Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo Error syncing Capacitor!
    pause
    exit /b 1
)
echo.

echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure OneSignal (see CAPACITOR_MIGRATION.md)
echo 2. Copy app icons and splash screens
echo 3. Open in Android Studio: npx cap open android
echo 4. Build and test the app
echo.
echo For detailed instructions, see CAPACITOR_MIGRATION.md
echo.
pause
