import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FavoriteItem {
  id: number;
  title: string;
  img: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem('tej_favorites');
    if (stored) {
      try {
        const favorites = JSON.parse(stored);
        this.favoritesSubject.next(favorites);
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }

  addFavorite(item: FavoriteItem): void {
    const current = this.favoritesSubject.value;
    if (!current.find(fav => fav.id === item.id)) {
      const updated = [...current, item];
      this.saveFavorites(updated);
    }
  }

  removeFavorite(id: number): void {
    const current = this.favoritesSubject.value;
    const updated = current.filter(fav => fav.id !== id);
    this.saveFavorites(updated);
  }

  clearFavorites(): void {
    this.saveFavorites([]);
  }

  isFavorite(id: number): boolean {
    return this.favoritesSubject.value.some(fav => fav.id === id);
  }

  private saveFavorites(favorites: FavoriteItem[]): void {
    localStorage.setItem('tej_favorites', JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }
}