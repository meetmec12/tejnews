import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

declare var OneSignal: any;

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
      console.log('Starting OneSignal initialization...');
      await this.platform.ready();
      
      if (this.platform.is('capacitor')) {
        console.log('Running on native platform');
        
        // Wait for OneSignal to be available with timeout
        let attempts = 0;
        const maxAttempts = 10;
        
        while (typeof OneSignal === 'undefined' && attempts < maxAttempts) {
          console.log(`Waiting for OneSignal... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
        
        if (typeof OneSignal === 'undefined') {
          console.error('OneSignal is not available after waiting');
          return;
        }
        
        console.log('OneSignal is available, initializing...');
        
        // Initialize OneSignal v5 API
        await OneSignal.initialize(this.appId);
        console.log('OneSignal initialized with app ID:', this.appId);
        
        // Request permission
        const permission = await OneSignal.Notifications.requestPermission(true);
        console.log('Permission granted:', permission);
        
        // Set up notification handlers
        OneSignal.Notifications.addEventListener('click', (event: any) => {
          console.log('Notification clicked:', event);
          const postId = event.notification.additionalData?.postId;
          if (postId) {
            this.router.navigate(['/news-detail', postId]);
          }
        });
        
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
          console.log('Notification received in foreground:', event);
          event.preventDefault();
          event.notification.display();
        });
        
        // Check subscription status
        const isSubscribed = await OneSignal.User.pushSubscription.getOptedIn();
        console.log('User subscribed:', isSubscribed);
        
        if (isSubscribed) {
          const subscriptionId = OneSignal.User.pushSubscription.getId();
          console.log('Subscription ID:', subscriptionId);
        }
        
        console.log('OneSignal initialization completed successfully');
        
      } else {
        console.log('OneSignal not available on web platform');
      }
      
    } catch (error) {
      console.error('OneSignal initialization error:', error);
    }
  }

  async getPlayerId(): Promise<string | null> {
    if (!this.platform.is('capacitor')) {
      return null;
    }

    try {
      return OneSignal.User.pushSubscription.getId();
    } catch (error) {
      console.error('Error getting OneSignal subscription ID:', error);
      return null;
    }
  }

  async setExternalUserId(userId: string) {
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      OneSignal.login(userId);
    } catch (error) {
      console.error('Error setting external user ID:', error);
    }
  }

  async sendTag(key: string, value: string) {
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      OneSignal.User.addTag(key, value);
    } catch (error) {
      console.error('Error sending tag:', error);
    }
  }

  async setNotificationEnabled(enabled: boolean) {
    if (!this.platform.is('capacitor')) {
      return;
    }

    try {
      if (enabled) {
        OneSignal.User.pushSubscription.optIn();
      } else {
        OneSignal.User.pushSubscription.optOut();
      }
    } catch (error) {
      console.error('Error setting notification enabled:', error);
    }
  }
}