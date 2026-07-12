import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  private fontSizeSubject = new BehaviorSubject<string>('medium');
  public fontSize$ = this.fontSizeSubject.asObservable();

  private fontSizes = {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px'
  };

  constructor() {
    this.loadFontSize();
  }

  private loadFontSize(): void {
    const stored = localStorage.getItem('tej_font_size') || 'medium';
    this.setFontSize(stored);
  }

  setFontSize(size: string): void {
    if (this.fontSizes[size as keyof typeof this.fontSizes]) {
      document.documentElement.style.setProperty('--app-font-size', this.fontSizes[size as keyof typeof this.fontSizes]);
      localStorage.setItem('tej_font_size', size);
      this.fontSizeSubject.next(size);
    }
  }

  getFontSize(): string {
    return this.fontSizeSubject.value;
  }

  getFontSizes() {
    return Object.keys(this.fontSizes);
  }
}