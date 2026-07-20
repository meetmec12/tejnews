import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service';
import { WelcomeService } from './services/welcome.service';
import { ModalController, MenuController, Platform } from '@ionic/angular';
import { WelcomeModalComponent } from './components/welcome-modal/welcome-modal.component';
import { Observable } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  isDarkMode$: Observable<boolean>;
  currentYear = new Date().getFullYear();

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private welcomeService: WelcomeService,
    private modalController: ModalController,
    private menuController: MenuController,
    private platform: Platform
  ) {
    this.isDarkMode$ = this.themeService.darkMode$;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      // Initialize Capacitor plugins
      if (this.platform.is('capacitor')) {
        try {
          await StatusBar.setStyle({ style: Style.Default });
          await SplashScreen.hide();
        } catch (error) {
          console.error('Error initializing Capacitor plugins:', error);
        }
      }
      
      // Add delay to ensure plugins are loaded
      setTimeout(() => {
        this.notificationService.initializeOneSignal();
      }, 1000);
      this.checkAndShowWelcome();
    });
  }

  private async checkAndShowWelcome() {
    if (!this.welcomeService.hasWelcomeBeenShown()) {
      setTimeout(async () => {
        const modal = await this.modalController.create({
          component: WelcomeModalComponent,
          backdropDismiss: true
        });
        modal.onDidDismiss().then(() => {
          this.welcomeService.markWelcomeAsShown();
        });
        await modal.present();
      }, 1000);
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  async closeMenu() {
    await this.menuController.close('main-menu');
  }

  async openAbout() {
    await this.closeMenu();
    // Will implement about modal
    console.log('Opening About Us');
  }

  async openContact() {
    await this.closeMenu();
    // Will implement contact modal
    console.log('Opening Contact Us');
  }
}
