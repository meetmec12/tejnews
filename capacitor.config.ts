import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tejcoms.news',
  appName: 'TEJ News',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#FFFFFF',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#FFFFFF'
    }
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: true
  }
};

export default config;
