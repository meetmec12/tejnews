import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PodcastPlayerPage } from './podcast-player.page';

const routes: Routes = [
  {
    path: '',
    component: PodcastPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PodcastPlayerPageRoutingModule {}
