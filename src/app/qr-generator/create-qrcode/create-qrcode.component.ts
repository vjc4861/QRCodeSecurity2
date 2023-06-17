import { Component, Input, OnInit, ViewChild  } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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
import { take } from 'rxjs';


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
  

  constructor(private router: Router, private alertController: AlertController ,private modalCtrl: ModalController, private renderer: Renderer2 ,private db: AngularFireDatabase, private qrgeneratorService: QrGeneratorService, private loaderCtrl: LoadingController, private imageQrService: ImageServiceService) { }

  ngOnInit() {
    // this.uuid = uuidv4();
  }

  onCloseModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
  
    await alert.present();
  }


  storeData(form: NgForm) {
    this.loaderCtrl
      .create({
        message: 'Storing data.....',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.qrgeneratorService.authService.userId
          .pipe(take(1))
          .subscribe((userId) => {
            if (!userId) {
              // If userId is null or undefined, you can either set a default value or display an error message.
            
              // Option 1: Dismiss the modal and display an error message.
              this.modalCtrl.dismiss();
              this.presentAlert('An error occurred', 'User ID is not available. Please sign in again.');
              return;
            
              // Option 2: Set a default value for userId.
              //userId = 'default-user-id';
              //continue with your other code
            }
            this.db
              .list('qrcodes')
              .push({
                qruuid: this.uuid,
                title: this.qrTitle,
                data: this.qrData,
                width: this.width,
                errorCorrectionLevel: this.errorCorrectionLevel,
                userId: userId
              })
              .then(() => {
                const newQrCode = new qrCode_model(
                  this.uuid,
                  Math.random().toString(),
                  this.qrTitle,
                  this.qrData,
                  this.width,
                  this.errorCorrectionLevel,
                  userId
                );
                this.qrgeneratorService.addingQrCode(newQrCode);
                loadingEl.dismiss();
                form.reset();
                // this.router.navigate(['qr-generator']);
                this.modalCtrl.dismiss(null, 'cancel');
              });
          });
      });
  }


  // storeData(form: NgForm){
  //   this.loaderCtrl.create({
  //     message: 'Storing data.....'
  //   }).then(loadingEl => {
  //     loadingEl.present();
  //     this.db.list('qrcodes').push({
  //       qruuid: this.uuid,
  //       title: this.qrTitle,
  //       data: this.qrData,
  //       width: this.width,
  //       errorCorrectionLevel: this.errorCorrectionLevel,
  //     }).then(() => {
  //       const newQrCode = new qrCode_model(this.uuid, Math.random().toString(), this.qrTitle, this.qrData, this.width, this.errorCorrectionLevel, this.qrgeneratorService.authService.userId);
  //       this.qrgeneratorService.addingQrCode(newQrCode);
  //       loadingEl.dismiss();
  //       form.reset();
  //   // this.router.navigate(['qr-generator']);
  //     this.modalCtrl.dismiss(null, 'cancel');
  //   });
  //     });
      
  //   }    
  //   // });

  


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
