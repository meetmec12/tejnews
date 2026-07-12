import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PodcastService } from '../services/podcast.service';
import { Podcast } from '../models/podcast.model';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.page.html',
  styleUrls: ['./podcasts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PodcastsPage implements OnInit {
  podcasts: Podcast[] = [];
  filteredPodcasts: Podcast[] = [];
  loading = false;
  page = 1;

  constructor(
    private podcastService: PodcastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPodcasts();
  }

  loadPodcasts(event?: any) {
    this.loading = true;
    this.podcastService.getPodcasts(this.page, 10).subscribe({
      next: (data) => {
        this.podcasts = [...this.podcasts, ...data];
        this.filteredPodcasts = this.podcasts;
        this.loading = false;
        if (event) {
          event.target.complete();
          if (data.length < 10) {
            event.target.disabled = true;
          }
        }
      },
      error: () => {
        this.loading = false;
        if (event) event.target.complete();
      }
    });
  }

  loadMore(event: any) {
    this.page++;
    this.loadPodcasts(event);
  }

  openPodcast(podcast: Podcast) {
    this.router.navigate(['/podcast-player', podcast.id]);
  }

  getThumbnail(podcast: Podcast): string {
    return podcast._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/img/placeholder.png';
  }

  doRefresh(event: any) {
    this.page = 1;
    this.podcasts = [];
    this.filteredPodcasts = [];
    this.podcastService.clearCache();
    this.loadPodcasts(event);
  }

  filterPodcasts(event: any) {
    const searchTerm = event.target.value?.toLowerCase() || '';
    this.filteredPodcasts = this.podcasts.filter(podcast => 
      podcast.title.rendered.toLowerCase().includes(searchTerm)
    );
  }
}
