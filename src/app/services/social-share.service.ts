import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {

  private isNative(): boolean {
    return !!(window as any).cordova || !!(window as any).PhoneGap || !!(window as any).phonegap;
  }

  shareToFacebook(url: string, title: string) {
    if (this.isNative()) {
      // Try native app first, fallback to web
      const nativeUrl = `fb://facewebmodal/f?href=${encodeURIComponent(url)}`;
      const fallbackUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
      
      window.location.href = nativeUrl;
      setTimeout(() => {
        window.open(fallbackUrl, '_system');
      }, 500);
    } else {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  shareToX(url: string, title: string) {
    if (this.isNative()) {
      // Try native app first, fallback to web
      const nativeUrl = `twitter://post?message=${encodeURIComponent(title + ' ' + url)}`;
      const fallbackUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      
      window.location.href = nativeUrl;
      setTimeout(() => {
        window.open(fallbackUrl, '_system');
      }, 500);
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  shareToWhatsApp(url: string, title: string) {
    const text = `${title} ${url}`;
    
    if (this.isNative()) {
      // Native WhatsApp URL scheme
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
      window.location.href = whatsappUrl;
    } else {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(shareUrl, '_blank');
    }
  }
}