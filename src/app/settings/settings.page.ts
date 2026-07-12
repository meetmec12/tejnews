import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { FontSizeService } from '../services/font-size.service';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit {
  isDarkMode$: Observable<boolean>;
  currentFontSize: string = 'medium';
  fontSizes: string[] = [];

  constructor(
    private themeService: ThemeService,
    private fontSizeService: FontSizeService,
    private toastController: ToastController
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngOnInit() {
    this.currentFontSize = this.fontSizeService.getFontSize();
    this.fontSizes = this.fontSizeService.getFontSizes();
  }

  onThemeToggle(event: any) {
    this.themeService.setDarkMode(event.detail.checked);
  }

  onFontSizeChange(event: any) {
    this.fontSizeService.setFontSize(event.detail.value);
    this.showToast(`Font size changed to ${event.detail.value}`);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}