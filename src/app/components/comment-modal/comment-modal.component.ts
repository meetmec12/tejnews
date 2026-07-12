import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { NewsService, CommentData } from '../../services/news.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
  standalone: false
})
export class CommentModalComponent {
  @Input() postId!: number;
  
  commentForm: FormGroup;
  submittingComment = false;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private toastController: ToastController
  ) {
    this.commentForm = this.formBuilder.group({
      author_name: ['', [Validators.required, Validators.minLength(2)]],
      author_email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async submitComment() {
    if (!this.commentForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.commentForm.controls).forEach(key => {
        this.commentForm.get(key)?.markAsTouched();
      });
      
      const toast = await this.toastController.create({
        message: 'Please fill in all required fields correctly',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.submittingComment = true;
    const commentData: CommentData = {
      post: this.postId,
      ...this.commentForm.value
    };

    this.newsService.addComment(commentData).subscribe({
      next: async (comment) => {
        this.submittingComment = false;
        const toast = await this.toastController.create({
          message: 'Comment added successfully',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.modalController.dismiss(comment);
      },
      error: async () => {
        this.submittingComment = false;
        const toast = await this.toastController.create({
          message: 'Failed to add comment',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}