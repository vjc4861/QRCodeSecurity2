import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { qrCode_model } from '../qr-generator.model';
import { QrGeneratorService } from '../qr-generator.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QRCodeModule } from 'angularx-qrcode';
import { ImageServiceService } from 'src/app/image-service.service';


@Component({
  selector: 'app-qrcode-detail',
  templateUrl: './qrcode-detail.page.html',
  styleUrls: ['./qrcode-detail.page.scss'],
})
export class QrcodeDetailPage implements OnInit, OnDestroy {

  qrcode?: qrCode_model;
  private qrSub!: Subscription;


  constructor( private imageQrService: ImageServiceService ,private route: ActivatedRoute, private navCtrl: NavController, private qrcodeService: QrGeneratorService) { }




  ngOnInit() {
    
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('qrcodeId')) {
        this.navCtrl.navigateBack('./qr-generator')
        return;
      }
      this.qrSub = this.qrcodeService.getQrcode(paramMap.get('qrcodeId')).subscribe(qrcode => {
        this.qrcode = qrcode;
        console.log(qrcode)
      });
    });
  }

  ngOnDestroy(): void {
    if (this.qrSub) {
      this.qrSub.unsubscribe();
    }
  }


}
