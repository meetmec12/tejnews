import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService, Comment, CommentData } from '../services/news.service';
import { FavoritesService } from '../services/favorites.service';
import { SocialShareService } from '../services/social-share.service';
import { NewsPost } from '../models/news.model';
import { ToastController, ModalController } from '@ionic/angular';
import { ShareModalComponent } from '../components/share-modal/share-modal.component';
import { CommentModalComponent } from '../components/comment-modal/comment-modal.component';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: false,
})
export class NewsDetailPage implements OnInit {
  post: NewsPost | null = null;
  comments: Comment[] = [];
  loading = true;
  commentsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private favoritesService: FavoritesService,
    private socialShareService: SocialShareService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(parseInt(id, 10));
    }
  }

  loadPost(id: number) {
    this.loading = true;
    this.newsService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
        if (post) {
          this.loadComments(post.id);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadComments(postId: number) {
    this.commentsLoading = true;
    this.newsService.getComments(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentsLoading = false;
      },
      error: () => {
        this.commentsLoading = false;
      }
    });
  }

  async openCommentModal() {
    if (!this.post) return;

    const modal = await this.modalController.create({
      component: CommentModalComponent,
      componentProps: {
        postId: this.post.id
      },
      cssClass: 'comment-modal',
      backdropDismiss: true
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.comments.unshift(result.data);
      }
    });

    await modal.present();
  }

  async addToFavorites() {
    if (!this.post) return;

    const favoriteItem = {
      id: this.post.id,
      title: this.post.title.rendered,
      img: this.getImageUrl()
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

  async shareNews() {
    if (!this.post) return;

    const modal = await this.modalController.create({
      component: ShareModalComponent,
      componentProps: {
        post: this.post,
        socialShareService: this.socialShareService
      },
      cssClass: 'share-modal',
      backdropDismiss: true
    });

    modal.onDidDismiss().then((result) => {
      if (result.data === 'copy') {
        this.showToast('Link copied to clipboard');
      }
    });

    await modal.present();
  }

  getImageUrl(): string {
    return this.post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/img/tejmain.png';
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

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}