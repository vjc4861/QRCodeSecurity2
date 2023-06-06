import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrcodeDetailPage } from './qrcode-detail.page';

const routes: Routes = [
  {
    path: '',
    component: QrcodeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrcodeDetailPageRoutingModule {}
