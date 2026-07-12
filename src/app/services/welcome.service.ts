import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WelcomeFormData {
  fullname: string;
  email: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {
  private readonly STORAGE_KEY = 'tej_welcome_shown';
  private readonly API_URL = 'https://tejcoms.com/appapi/api/add/welcome';

  constructor(private http: HttpClient) {}

  hasWelcomeBeenShown(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  markWelcomeAsShown(): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  submitWelcomeForm(data: WelcomeFormData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const formData = new URLSearchParams();
    formData.set('fullname', data.fullname);
    formData.set('email', data.email);
    if (data.phone) {
      formData.set('phone', data.phone);
    }
    
    return this.http.post(this.API_URL, formData.toString(), { headers });
  }
}