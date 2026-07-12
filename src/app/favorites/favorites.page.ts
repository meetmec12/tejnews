import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService, FavoriteItem } from '../services/favorites.service';
import { NewsService } from '../services/news.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false,
})
export class FavoritesPage implements OnInit {
  favorites$: Observable<FavoriteItem[]>;

  constructor(
    private router: Router,
    private favoritesService: FavoritesService,
    private newsService: NewsService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.favorites$ = this.favoritesService.favorites$;
  }

  ngOnInit() {}

  async removeFavorite(item: FavoriteItem) {
    const alert = await this.alertController.create({
      header: 'Remove Favorite',
      message: `Remove "${item.title}" from favorites?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.favoritesService.removeFavorite(item.id);
            this.showToast('Removed from favorites');
          }
        }
      ]
    });

    await alert.present();
  }

  async clearAllFavorites() {
    const alert = await this.alertController.create({
      header: 'Clear All Favorites',
      message: 'Are you sure you want to remove all favorites? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear All',
          role: 'destructive',
          handler: () => {
            this.favoritesService.clearFavorites();
            this.showToast('All favorites cleared');
          }
        }
      ]
    });

    await alert.present();
  }

  openFavoriteDetail(item: FavoriteItem) {
    this.router.navigate(['/news', item.id]);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getImageUrl(item: FavoriteItem): string {
    return item.img || 'assets/img/tejmain.png';
  }
}
