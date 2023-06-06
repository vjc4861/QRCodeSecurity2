import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddQrcodePageRoutingModule } from './add-qrcode-routing.module';

import { AddQrcodePage } from './add-qrcode.page';

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddQrcodePageRoutingModule
  ],
  declarations: [AddQrcodePage]
})
export class AddQrcodePageModule {}
