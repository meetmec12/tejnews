import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly NOTIFICATIONS_KEY = 'notifications_enabled';

  constructor(private notificationService: NotificationService) {}

  getNotificationsEnabled(): boolean {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  }

  async setNotificationsEnabled(enabled: boolean) {
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(enabled));
    await this.notificationService.setNotificationEnabled(enabled);
  }
}