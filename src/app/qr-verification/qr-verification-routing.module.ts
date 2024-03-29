import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrVerificationPage } from './qr-verification.page';

const routes: Routes = [
  {
    path: '',
    component: QrVerificationPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrVerificationPageRoutingModule {}
