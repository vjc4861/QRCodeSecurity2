import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrGeneratorPageRoutingModule } from './qr-generator-routing.module';

import { QrGeneratorPage } from './qr-generator.page';

import { QRCodeModule } from 'angularx-qrcode';
import { CreateQrcodeComponent } from './create-qrcode/create-qrcode.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrGeneratorPageRoutingModule,
    QRCodeModule,
  ],
  declarations: [QrGeneratorPage, CreateQrcodeComponent],
  
})
export class QrGeneratorPageModule {}
