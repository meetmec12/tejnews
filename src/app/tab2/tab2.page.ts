import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../services/news.service';
import { Category, NewsPost } from '../models/news.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryPosts: NewsPost[] = [];
  loading = true;
  loadingPosts = false;

  constructor(
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.newsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (categories.length > 0) {
          this.selectCategory(categories[0]);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.loadCategoryPosts(category.id);
  }

  loadCategoryPosts(categoryId: number) {
    this.loadingPosts = true;
    this.newsService.getPostsByCategory(categoryId).subscribe({
      next: (posts) => {
        this.categoryPosts = posts;
        this.loadingPosts = false;
      },
      error: () => {
        this.loadingPosts = false;
      }
    });
  }

  doRefresh(event: any) {
    this.newsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (this.selectedCategory) {
          this.loadCategoryPosts(this.selectedCategory.id);
        }
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
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

  openNewsDetail(post: NewsPost) {
    this.router.navigate(['/news', post.id]);
  }
}
