import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Podcast } from '../models/podcast.model';

@Injectable({
  providedIn: 'root'
})
export class PodcastService {
  private baseUrl = 'https://tejcoms.com/wp-json/wp/v2';
  private cache = new Map<string, any>();
  private podcastCategoryId = 131; // Podcast category ID from WordPress

  constructor(private http: HttpClient) {}

  setPodcastCategoryId(categoryId: number) {
    this.podcastCategoryId = categoryId;
  }

  getPodcasts(page: number = 1, perPage: number = 10): Observable<Podcast[]> {
    const cacheKey = `podcasts_${page}_${perPage}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    const url = this.podcastCategoryId > 0
      ? `${this.baseUrl}/posts?_embed&categories=${this.podcastCategoryId}&per_page=${perPage}&page=${page}`
      : `${this.baseUrl}/posts?_embed&per_page=${perPage}&page=${page}`;

    return this.http.get<Podcast[]>(url).pipe(
      map(podcasts => {
        this.cache.set(cacheKey, podcasts);
        return podcasts;
      }),
      catchError(() => of([]))
    );
  }

  getPodcastById(id: number): Observable<Podcast | null> {
    return this.http.get<Podcast>(`${this.baseUrl}/posts/${id}?_embed`).pipe(
      map(podcast => podcast || null),
      catchError(() => of(null))
    );
  }

  extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  clearCache() {
    this.cache.clear();
  }
}
