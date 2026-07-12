import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: false,
})
export class ContactPage implements OnInit {

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  async sendMessage() {
    const toast = await this.toastController.create({
      message: 'Thank you for your message! We will get back to you soon.',
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

}