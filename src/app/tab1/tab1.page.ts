import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { FavoritesService } from '../services/favorites.service';
import { ThemeService } from '../services/theme.service';
import { NewsPost } from '../models/news.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  posts: NewsPost[] = [];
  loading = true;
  sliderPosts: NewsPost[] = [];
  currentSlide = 0;
  private slideInterval: any;

  constructor(
    private router: Router,
    private newsService: NewsService,
    public favoritesService: FavoritesService,
    private themeService: ThemeService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  loadPosts() {
    this.loading = true;
    this.newsService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.sliderPosts = posts.slice(0, 5);
        this.loading = false;
        this.startAutoSlide();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  doRefresh(event: any) {
    this.newsService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.sliderPosts = posts.slice(0, 5);
        this.startAutoSlide();
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  openNewsDetail(post: NewsPost) {
    this.router.navigate(['/news', post.id]);
  }

  async addToFavorites(post: NewsPost) {
    const favoriteItem = {
      id: post.id,
      title: post.title.rendered,
      img: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''
    };
    
    this.favoritesService.addFavorite(favoriteItem);
    
    const toast = await this.toastController.create({
      message: 'Added to favorites',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  getImageUrl(post: NewsPost): string {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/img/tejmain.png';
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  }

  startAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.sliderPosts.length > 1) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.sliderPosts.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.startAutoSlide();
  }
}
