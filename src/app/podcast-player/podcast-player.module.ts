import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PodcastPlayerPageRoutingModule } from './podcast-player-routing.module';

import { PodcastPlayerPage } from './podcast-player.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PodcastPlayerPageRoutingModule,
    PodcastPlayerPage
  ]
})
export class PodcastPlayerPageModule {}
