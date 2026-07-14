import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import OneSignal from '@onesignal/capacitor-plugin';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private appId = 'c1b98255-4be3-49f2-b270-371739e46e44';

  constructor(
    private platform: Platform,
    private router: Router
  ) {}

  async initializeOneSignal() {
    try {
      await this.platform.ready();

      if (!this.platform.is('capacitor')) {
        console.log('OneSignal not available on web platform');
        return;
      }

      OneSignal.initialize(this.appId);

      await OneSignal.Notifications.requestPermission(true);

      OneSignal.Notifications.addEventListener('click', (event: any) => {
        const postId = event.notification?.additionalData?.postId;
        if (postId) {
          this.router.navigate(['/news', postId]);
        }
      });

    } catch (error) {
      console.error('OneSignal initialization error:', error);
    }
  }

  async getPlayerId(): Promise<string | null> {
    if (!this.platform.is('capacitor')) return null;
    try {
      const id = await OneSignal.User.pushSubscription.getIdAsync();
      return id ?? null;
    } catch (error) {
      return null;
    }
  }

  async setExternalUserId(userId: string) {
    if (!this.platform.is('capacitor')) return;
    try {
      OneSignal.login(userId);
    } catch (error) {
      console.error('Error setting external user ID:', error);
    }
  }

  async sendTag(key: string, value: string) {
    if (!this.platform.is('capacitor')) return;
    try {
      OneSignal.User.addTag(key, value);
    } catch (error) {
      console.error('Error sending tag:', error);
    }
  }

  async setNotificationEnabled(enabled: boolean) {
    if (!this.platform.is('capacitor')) return;
    try {
      if (enabled) {
        await OneSignal.User.pushSubscription.optIn();
      } else {
        await OneSignal.User.pushSubscription.optOut();
      }
    } catch (error) {
      console.error('Error setting notification enabled:', error);
    }
  }
}
