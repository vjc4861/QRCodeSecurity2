import { Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IonItemSliding, LoadingController, ModalController } from '@ionic/angular';
// import { QRCodeVersion, QRCodeComponent } from 'angularx-qrcode';
import { Subscription, combineLatest, map, take } from 'rxjs';
import { CreateQrcodeComponent } from './create-qrcode/create-qrcode.component';
import { qrCode_model } from './qr-generator.model';
import { QrGeneratorService } from './qr-generator.service';



@Component({
  selector: 'app-qr-generator',
  templateUrl: 'qr-generator.page.html',
  styleUrls: ['qr-generator.page.scss']
})



export class QrGeneratorPage implements OnInit, OnDestroy {

  loadedQr!: qrCode_model[];
  
  private qrcodesSub!: Subscription;
  deletedQrCodeSub: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,  private qrGeneratorService: QrGeneratorService, private cd: ChangeDetectorRef, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {}
  
  // ngOnInit(): void {
  //   // throw new Error('Method not implemented.');
  //   // this.loadedQr = this.qrGeneratorService.qrcodes
  //   this.qrcodesSub = this.qrGeneratorService.qrcodes.subscribe(qrcodes => {
  //     this.loadedQr = qrcodes;
  //     // console.log(this.loadedQr);
      
  //   });
    
  // }

  fetchQRCodes() {
    // Replace the following with the correct method and parameters to fetch the relevant QR codes
    this.qrGeneratorService.fetchDatafromDb().subscribe(loadedQRCode => {
      console.log('Fetched loaded QR codes:', loadedQRCode);
      this.loadedQr = loadedQRCode;
      console.log(this.loadedQr);
    });
  }

  async ngOnInit() {
    this.fetchQRCodes();
    this.changeDetectorRef.detectChanges();
    const qrcodes = await this.qrGeneratorService.fetchDatafromDb().pipe(take(1)).toPromise();
    this.qrGeneratorService._qrcodes.next(qrcodes);
    this.loadedQr = qrcodes;
  
    this.qrcodesSub = this.qrGeneratorService.qrcodes.subscribe(qrcodes => {
        this.loadedQr = qrcodes;
    });
  
    this.deletedQrCodeSub = this.qrGeneratorService.qrCodeDeleted$.subscribe(deletedId => {
      console.log('Deleted ID:', deletedId);
      if (deletedId) {
        this.loadedQr = [...this.loadedQr.filter(qr => qr.qid !== deletedId)];
        this.cd.detectChanges();
      }
    });
  }

  // async ngOnInit() {
  //   const storedQr = localStorage.getItem('loadedQr');
  //   if (storedQr) {
  //     this.loadedQr = JSON.parse(storedQr);
  //   } 

  //     this.qrGeneratorService._qrcodes.next(this.loadedQr);
  //     this.fetchQRCodes();
    

  //   this.qrGeneratorService._qrcodes.next(this.loadedQr);

  //   this.qrcodesSub = this.qrGeneratorService.qrcodes.subscribe(qrcodes => {
  //     this.loadedQr = qrcodes;
  //   });

  //   this.deletedQrCodeSub = this.qrGeneratorService.qrCodeDeleted$.subscribe(deletedId => {
  //     console.log('Deleted ID:', deletedId);
  //     if (deletedId) {
  //       this.loadedQr = [...this.loadedQr.filter(qr => qr.qid !== deletedId)];
  //       this.cd.detectChanges();
  //     }
  //   });
  // }


  ngOnDestroy() {
    if (this.qrcodesSub) {
      this.qrcodesSub.unsubscribe();
    }
    if (this.deletedQrCodeSub) {
      this.deletedQrCodeSub.unsubscribe();
    }
  }

  onCreateNewQrCode(){
    console.log("Openning Modal")
    this.modalCtrl.create({component: CreateQrcodeComponent}).then(modalEl => {
      modalEl.present();
    });
  }

  onCancelQrCode(qrcodeId: string, slidingEl: IonItemSliding) {
    console.log("from pagets", qrcodeId)
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Deleting Qrcode ....' }).then(loadingEl => {
      loadingEl.present();
      console.log("from pagets", qrcodeId)
      this.qrGeneratorService.cancelQrcode(qrcodeId).subscribe(() => {
        this.loadedQr = this.loadedQr.filter(qr => qr.qruuid !== qrcodeId);
        loadingEl.dismiss().then(() => {
          this.fetchQRCodes();
        });
      });
    });
  }
}
  // onCancelQrCode(qrcodeId: string, slidingEl: IonItemSliding){
  //   console.log("from pagets", qrcodeId)
  //   slidingEl.close();
  //   this.loadingCtrl.create({message: 'Deleting Qrcode ....'}).then(loadingEl => {
  //     loadingEl.present();
  //     console.log("from pagets", qrcodeId)
  //     // this.qrGeneratorService.cancelQrcode(qrcodeId);
  //     // loadingEl.dismiss();
  //     this.qrGeneratorService.cancelQrcode(qrcodeId).subscribe(() => {
  //       loadingEl.dismiss();
  //     });
  //   });
  
    
    // cancel booking with id qrcodeId
  
