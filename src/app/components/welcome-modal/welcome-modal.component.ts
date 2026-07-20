import { Component } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WelcomeService, WelcomeFormData } from '../../services/welcome.service';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
  standalone: false
})
export class WelcomeModalComponent {
  welcomeForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private welcomeService: WelcomeService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.welcomeForm = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  async onSubmit() {
    console.log('Form valid:', this.welcomeForm.valid);
    console.log('Form values:', this.welcomeForm.value);
    console.log('Form errors:', this.welcomeForm.errors);
    
    if (this.welcomeForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Submitting...'
      });
      await loading.present();

      const formData: WelcomeFormData = this.welcomeForm.value;

      this.welcomeService.submitWelcomeForm(formData).subscribe({
        next: async () => {
          await loading.dismiss();
          this.welcomeService.markWelcomeAsShown();
          await this.showToast('Welcome! Thank you for joining us.', 'success');
          await this.modalController.dismiss();
        },
        error: async (error) => {
          await loading.dismiss();
          console.error('Welcome form submission error:', error);
          await this.showToast('Failed to submit. Please try again.', 'danger');
        }
      });
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async dismiss() {
    this.welcomeService.markWelcomeAsShown();
    await this.modalController.dismiss();
  }
}