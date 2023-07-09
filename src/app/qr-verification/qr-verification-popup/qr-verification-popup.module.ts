import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrVerificationPopupPageRoutingModule } from './qr-verification-popup-routing.module';

import { QrVerificationPopupPage } from './qr-verification-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrVerificationPopupPageRoutingModule
  ],
  declarations: [QrVerificationPopupPage],
})
export class QrVerificationPopupPageModule {}
