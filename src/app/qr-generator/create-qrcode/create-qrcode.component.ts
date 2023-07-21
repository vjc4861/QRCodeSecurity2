import { Component, OnInit, ViewChild  } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { QRCodeComponent } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { QrGeneratorService } from '../qr-generator.service';
import { v4 as quuid } from 'uuid';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { ImageServiceService } from 'src/app/image-service.service';
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
  isGenerated: boolean = true;

  

  @ViewChild(QRCodeComponent) qrCode!: QRCodeComponent;
  

  constructor(private router: Router, private alertController: AlertController ,private modalCtrl: ModalController, private renderer: Renderer2 ,private db: AngularFireDatabase, private qrgeneratorService: QrGeneratorService, private loadCtrl: LoadingController, private imageQrService: ImageServiceService) { }

  ngOnInit() {
    // this.uuid = uuidv4();
  }

  onCloseModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async alertPresenting(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
  
    await alert.present();
  }


  dataStorage(form: NgForm) {
    this.loadCtrl
      .create({
        message: 'Storing data.....',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.qrgeneratorService.authenService.userId
          .pipe(take(1))
          .subscribe((userId) => {
            if (!userId) {
              // If userId is null or undefined, you can either set a default value or display an error message.
            
              // Option 1: Dismiss the modal and display an error message.
              this.modalCtrl.dismiss();
              this.alertPresenting('An error occurred', 'User ID is not available. Please sign in again.');
              return;
            
              // Option 2: Set a default value for userId.
              //userId = 'default-user-id';
              
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
                
                loadingEl.dismiss();
                form.reset();
                // this.router.navigate(['qr-generator']);
                this.modalCtrl.dismiss(null, 'cancel');
              });
          });
      });
  }

}
