import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const stored = localStorage.getItem('tej_dark_mode');
    const isDark = stored === 'true';
    this.setDarkMode(isDark);
  }

  toggleDarkMode(): void {
    const current = this.darkModeSubject.value;
    this.setDarkMode(!current);
  }

  setDarkMode(isDark: boolean): void {
    document.body.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('tej_dark_mode', isDark.toString());
    this.darkModeSubject.next(isDark);
  }
}