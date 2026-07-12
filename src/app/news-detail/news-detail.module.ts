import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewsDetailPageRoutingModule } from './news-detail-routing.module';
import { NewsDetailPage } from './news-detail.page';
import { ShareModalComponent } from '../components/share-modal/share-modal.component';
import { CommentModalComponent } from '../components/comment-modal/comment-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewsDetailPageRoutingModule
  ],
  declarations: [NewsDetailPage, ShareModalComponent, CommentModalComponent]
})
export class NewsDetailPageModule {}