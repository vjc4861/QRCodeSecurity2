import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrVerificationPage } from './qr-verification.page';

const routes: Routes = [
  {
    path: '',
    component: QrVerificationPage
  },
  // {
  //   path: 'qr-verification-popup',
  //   loadChildren: () => import('./qr-verification-popup/qr-verification-popup.module').then( m => m.QrVerificationPopupPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrVerificationPageRoutingModule {}
