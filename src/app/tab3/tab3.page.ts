import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { LiveTVPage } from '../models/news.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  liveTV: LiveTVPage | null = null;
  loading = true;
  error = false;
  videoUrl: SafeResourceUrl | null = null;

  constructor(
    private newsService: NewsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadLiveTV();
  }

  loadLiveTV() {
    this.loading = true;
    this.error = false;
    
    this.newsService.getLiveTV().subscribe({
      next: (liveTV) => {
        this.liveTV = liveTV;
        if (liveTV) {
          this.extractVideoUrl(liveTV.content.rendered);
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  extractVideoUrl(content: string) {
    // Extract iframe src
    const iframeMatch = content.match(/<iframe[^>]+src="([^">]+)"/);
    if (iframeMatch && iframeMatch[1]) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(iframeMatch[1]);
      return;
    }

    // Extract video src
    const videoMatch = content.match(/<video[^>]+src="([^">]+)"/);
    if (videoMatch && videoMatch[1]) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoMatch[1]);
      return;
    }

    // Extract YouTube URL
    const youtubeMatch = content.match(/(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^"\s&]+|https?:\/\/youtu\.be\/[^"\s?]+)/);
    if (youtubeMatch && youtubeMatch[1]) {
      let videoId = '';
      const url = youtubeMatch[1];
      
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        return;
      }
    }

    // If no video found, show error
    this.error = true;
  }

  getCleanContent(content: string): string {
    return content.replace(/https?:\/\/[^\s<>"]+/g, '');
  }

  doRefresh(event: any) {
    this.newsService.getLiveTV().subscribe({
      next: (liveTV) => {
        this.liveTV = liveTV;
        if (liveTV) {
          this.extractVideoUrl(liveTV.content.rendered);
        }
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  retry() {
    this.loadLiveTV();
  }
}
