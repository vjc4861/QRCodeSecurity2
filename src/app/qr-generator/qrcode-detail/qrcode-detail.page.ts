import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription, take, throwError } from 'rxjs';
import { qrCode_model } from '../qr-generator.model';
import { QrGeneratorService } from '../qr-generator.service';
import { QRCodeComponent } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QRCodeModule } from 'angularx-qrcode';
import { ImageServiceService } from 'src/app/image-service.service';
import { LoadingController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-qrcode-detail',
  templateUrl: './qrcode-detail.page.html',
  styleUrls: ['./qrcode-detail.page.scss'],
})
export class QrcodeDetailPage implements OnInit, OnDestroy, OnChanges {

  @Input() qrcode?: qrCode_model;
  private qrSub!: Subscription;
  // activatedRoute: any;
  // activatedRoute: any;

  

  constructor( private loadingController: LoadingController, private imageQrService: ImageServiceService ,private route: ActivatedRoute, private navCtrl: NavController, private qrcodeService: QrGeneratorService) { }
  
// The NgOnInit is the most imp. This solves our refresh disappearace issue and data staying issue
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('qrcodeId')) {
        this.navCtrl.navigateBack('./qr-generator');
        return;
      }
      const qrcodeId = paramMap.get('qrcodeId');
      let storedQrcode = localStorage.getItem('qrcode_details_' + qrcodeId);
      if (storedQrcode) {
        this.qrcode = JSON.parse(storedQrcode);
        console.log(this.qrcode);
      } else {
        this.qrSub = this.qrcodeService
          .getQrcode(qrcodeId)
          .subscribe(qrcode => {
            this.qrcode = qrcode;
            localStorage.setItem(
              'qrcode_details_' + qrcodeId,
              JSON.stringify(qrcode)
            );
            console.log(qrcode);
          });
      }
    });
  }
  
  // IMP WORKING BELOW!!!!
  // ngOnInit() {
  //   this.route.paramMap.subscribe(paramMap => {
  //     if (!paramMap.has('qrcodeId')) {
  //       this.navCtrl.navigateBack('./qr-generator');
  //       return;
  //     }
  //     this.qrSub = this.qrcodeService
  //       .getQrcode(paramMap.get('qrcodeId'))
  //       .subscribe(qrcode => {
  //         this.qrcode = qrcode;
  //         console.log(qrcode);
  //       });
  //   });
  // }




  
  ngOnChanges(changes: SimpleChanges) {
    // Only update when the prop changes
    if (changes['qrcode']) {
      this.qrcode = changes['qrcode'].currentValue;
    }
  }
  
  

  ngOnDestroy(): void {
    if (this.qrSub) {
      this.qrSub.unsubscribe();
    }
  }

  // ionViewDidLeave() {
  //   localStorage.removeItem('loadedQr');
  // }


}
