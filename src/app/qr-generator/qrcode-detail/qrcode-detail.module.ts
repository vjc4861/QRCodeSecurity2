import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";

import { IonicModule } from '@ionic/angular';

import { QrcodeDetailPageRoutingModule } from './qrcode-detail-routing.module';

import { QrcodeDetailPage } from './qrcode-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrcodeDetailPageRoutingModule,
    QRCodeModule
    
    
  ],
  declarations: [QrcodeDetailPage]
})
export class QrcodeDetailPageModule {}
