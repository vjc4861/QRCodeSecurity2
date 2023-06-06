import { Component, Input, OnInit, ViewChild  } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { QRCodeComponent } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QrGeneratorService } from '../qr-generator.service';
// import { v4 as uuidv4 } from 'uuid';
import { v4 as quuid } from 'uuid';
import { Router } from '@angular/router';
import { qrCode_model } from '../qr-generator.model';
import { Renderer2 } from '@angular/core';
import { ImageServiceService } from 'src/app/image-service.service';
import { SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-create-qrcode',
  templateUrl: './create-qrcode.component.html',
  styleUrls: ['./create-qrcode.component.scss'],
})
export class CreateQrcodeComponent implements OnInit {


  
  
  uuid: string = quuid();
  qrTitle!: string;
  qrData!: string;
  width!: number;
  errorCorrectionLevel!: QRCodeErrorCorrectionLevel ;
  // version!: QRCodeVersion;
  isGenerated: boolean = true;
  // uuidNData = `${this.qrData}`;
  // qrData2 = this.uuidNData.split(',')[1];

  // uuid!: string;
  

  @ViewChild(QRCodeComponent) qrCode!: QRCodeComponent;
  

  constructor(private router: Router, private modalCtrl: ModalController, private renderer: Renderer2 ,private db: AngularFireDatabase, private qrgeneratorService: QrGeneratorService, private loaderCtrl: LoadingController, private imageQrService: ImageServiceService) { }

  ngOnInit() {
    // this.uuid = uuidv4();
  }

  onCloseModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // private getBase64(element: HTMLElement): string {
  //   const svgElement = this.renderer.selectRootElement(element);
  //   let svgData = new XMLSerializer().serializeToString(svgElement);
  //   // Encode image to base64
  //   const base64 = btoa(unescape(encodeURIComponent(svgData)));
  //   return `data:image/svg+xml;base64,${base64}`;
  // }

  // get uuidNData(): string{
  //   this.uuid = uuidv4();
  //   return `${this.uuid},${this.qrData}`;
  // }
  

  storeData(form: NgForm){
    this.loaderCtrl.create({
      message: 'Storing data.....'
    }).then(loadingEl => {
      loadingEl.present();
      this.db.list('qrcodes').push({
        qruuid: this.uuid,
        title: this.qrTitle,
        data: this.qrData,
        width: this.width,
        errorCorrectionLevel: this.errorCorrectionLevel,
      }).then(() => {
        const newQrCode = new qrCode_model(this.uuid, Math.random().toString(), this.qrTitle, this.qrData, this.width, this.errorCorrectionLevel, this.qrgeneratorService.authService.userId);
        this.qrgeneratorService.addingQrCode(newQrCode);
        loadingEl.dismiss();
        form.reset();
    // this.router.navigate(['qr-generator']);
      this.modalCtrl.dismiss(null, 'cancel');
    });
      });
      
    }    
    // });

  


    // this.qrgeneratorService.addQrcode(this.uuid, this.qrTitle, this.qrData, this.width, this.errorCorrectionLevel).subscribe(() => { });
    
    
  
  // DO NOT DELETE the code below....this works and sends the data to the db
  // storeData(form: NgForm) {
  //   this.db.list('/qr-codes').push({
  //     qrData: this.qrData,
  //     width: this.width,
  //     errorCorrectionLevel: this.errorCorrectionLevel,
  //   });
  //   form.reset();
  //   this.qrData = "";
  //   this.modalCtrl.dismiss(null, 'cancel');
    
  // }

}
