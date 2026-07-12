import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PodcastService } from '../services/podcast.service';
import { Podcast } from '../models/podcast.model';

@Component({
  selector: 'app-podcast-player',
  templateUrl: './podcast-player.page.html',
  styleUrls: ['./podcast-player.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PodcastPlayerPage implements OnInit {
  podcast: Podcast | null = null;
  loading = true;
  youtubeEmbedUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private podcastService: PodcastService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPodcast(parseInt(id, 10));
    }
  }

  loadPodcast(id: number) {
    this.loading = true;
    this.podcastService.getPodcastById(id).subscribe({
      next: (data) => {
        this.podcast = data;
        this.loading = false;
        if (data) {
          // Try content first, then excerpt
          const contentToSearch = data.content?.rendered || data.excerpt?.rendered || '';
          this.extractMediaUrl(contentToSearch);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  extractMediaUrl(content: string) {
    // First try to extract from iframe src
    const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/i;
    const iframeMatch = content.match(iframeRegex);
    
    if (iframeMatch && iframeMatch[1]) {
      const iframeSrc = iframeMatch[1];
      // Extract video ID from iframe src
      const embedMatch = iframeSrc.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch && embedMatch[1]) {
        const videoId = embedMatch[1];
        this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&enablejsapi=1`
        );
        console.log('YouTube video found in iframe:', videoId);
        return;
      }
    }
    
    // Fallback: Remove HTML tags and search for URLs
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Multiple YouTube URL patterns
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        const videoId = match[1];
        this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&enablejsapi=1`
        );
        console.log('YouTube video found:', videoId);
        return;
      }
    }
    
    console.log('No YouTube URL found in content');
  }

  getThumbnail(): string {
    return this.podcast?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/img/placeholder.png';
  }
}
