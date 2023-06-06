import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddQrcodePage } from './add-qrcode.page';

const routes: Routes = [
  {
    path: '',
    component: AddQrcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddQrcodePageRoutingModule {}
