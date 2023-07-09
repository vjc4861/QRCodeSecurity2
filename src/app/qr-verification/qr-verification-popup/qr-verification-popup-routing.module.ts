import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrVerificationPopupPage } from './qr-verification-popup.page';

const routes: Routes = [
  {
    path: '',
    component: QrVerificationPopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrVerificationPopupPageRoutingModule {}
