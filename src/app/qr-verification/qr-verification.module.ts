import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrVerificationPageRoutingModule } from './qr-verification-routing.module';

import { QrVerificationPage } from './qr-verification.page';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
// import { QrVerificationPopupPageModule } from './qr-verification-popup/qr-verification-popup.module';
import { QrVerificationPopupPage } from './qr-verification-popup/qr-verification-popup.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrVerificationPageRoutingModule,
    ZXingScannerModule
  ],
  declarations: [QrVerificationPage],
  
})
export class QrVerificationPageModule {

  




}
