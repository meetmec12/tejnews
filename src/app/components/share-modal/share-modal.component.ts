import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewsPost } from '../../models/news.model';
import { SocialShareService } from '../../services/social-share.service';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  standalone: false
})
export class ShareModalComponent {
  @Input() post!: NewsPost;
  @Input() socialShareService!: SocialShareService;

  constructor(private modalController: ModalController) {}

  shareToFacebook() {
    this.socialShareService.shareToFacebook(this.post.link, this.post.title.rendered);
    this.dismiss();
  }

  shareToX() {
    this.socialShareService.shareToX(this.post.link, this.post.title.rendered);
    this.dismiss();
  }

  shareToWhatsApp() {
    this.socialShareService.shareToWhatsApp(this.post.link, this.post.title.rendered);
    this.dismiss();
  }

  copyLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.post.link);
      this.dismiss('copy');
    }
  }

  dismiss(data?: string) {
    this.modalController.dismiss(data);
  }
}