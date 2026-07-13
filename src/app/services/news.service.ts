import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NewsPost, Category, LiveTVPage } from '../models/news.model';

export interface Comment {
  id: number;
  post: number;
  author_name: string;
  author_email: string;
  date: string;
  content: {
    rendered: string;
  };
}

export interface CommentData {
  post: number;
  author_name: string;
  author_email: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = 'https://tejcoms.com/wp-json/wp/v2';
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  getPosts(page: number = 1, perPage: number = 10): Observable<NewsPost[]> {
    const cacheKey = `posts_${page}_${perPage}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return this.http.get<NewsPost[]>(`${this.baseUrl}/posts?_embed&per_page=${perPage}&page=${page}&categories_exclude=131`)
      .pipe(
        map(posts => {
          const decodedPosts = posts.map(post => this.decodeHtmlEntities(post));
          this.cache.set(cacheKey, decodedPosts);
          return decodedPosts;
        }),
        catchError((error) => {
          const msg = `STATUS: ${error.status} | MSG: ${error.message} | URL: ${error.url} | ORIGIN: ${window.location.origin}`;
          alert('DEBUG ERROR: ' + msg);
          console.error('getPosts error:', msg);
          return of([]);
        })
      );
  }

  getCategories(): Observable<Category[]> {
    const cacheKey = 'categories';
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return this.http.get<Category[]>(`${this.baseUrl}/categories?per_page=20`)
      .pipe(
        map(categories => {
          const filtered = categories.filter(cat => cat.count > 0 && cat.slug !== 'uncategorized');
          this.cache.set(cacheKey, filtered);
          return filtered;
        }),
        catchError(() => of([]))
      );
  }

  getPostsByCategory(categoryId: number, page: number = 1): Observable<NewsPost[]> {
    const cacheKey = `category_${categoryId}_${page}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    return this.http.get<NewsPost[]>(`${this.baseUrl}/posts?_embed&categories=${categoryId}&orderby=date&order=desc&page=${page}`)
      .pipe(
        map(posts => {
          const decodedPosts = posts.map(post => this.decodeHtmlEntities(post));
          this.cache.set(cacheKey, decodedPosts);
          return decodedPosts;
        }),
        catchError(() => of([]))
      );
  }

  getLiveTV(): Observable<LiveTVPage | null> {
    return this.http.get<LiveTVPage[]>(`${this.baseUrl}/pages?slug=live-tv&_embed`)
      .pipe(
        map(pages => pages.length > 0 ? pages[0] : null),
        catchError(() => of(null))
      );
  }

  getPostById(id: number): Observable<NewsPost | null> {
    return this.http.get<NewsPost>(`${this.baseUrl}/posts/${id}?_embed`)
      .pipe(
        map(post => post ? this.decodeHtmlEntities(post) : null),
        catchError(() => of(null))
      );
  }

  private decodeHtmlEntities(post: NewsPost): NewsPost {
    return {
      ...post,
      title: {
        rendered: this.decodeHtml(post.title.rendered)
      },
      content: {
        rendered: this.decodeHtml(post.content.rendered)
      },
      excerpt: {
        rendered: this.decodeHtml(post.excerpt.rendered)
      }
    };
  }

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/comments?post=${postId}&orderby=date&order=desc`)
      .pipe(
        catchError(() => of([]))
      );
  }

  addComment(commentData: CommentData): Observable<Comment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const formData = new URLSearchParams();
    formData.set('post', commentData.post.toString());
    formData.set('author_name', commentData.author_name);
    formData.set('author_email', commentData.author_email);
    formData.set('content', commentData.content);
    
    return this.http.post<Comment>(`${this.baseUrl}/comments`, formData.toString(), { headers });
  }
}