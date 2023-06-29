import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { QrGeneratorService } from '../qr-generator/qr-generator.service';
import { BarcodeFormat } from '@zxing/library';
import { AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';


@Component({
  selector: 'app-qr-verification',
  templateUrl: './qr-verification.page.html',
  styleUrls: ['./qr-verification.page.scss'],
})
export class QrVerificationPage implements OnInit {

  constructor(private changeDetector: ChangeDetectorRef ,private qrGeneratorService: QrGeneratorService, private alertController: AlertController, private db: AngularFireDatabase) { }

  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;


  qrcodeFormat = BarcodeFormat.QR_CODE;
  isCameraVisible = true;

  ngOnInit() {
  }


  // resumeScan(): void {
  //   this.scanner.scanStart // Starts the scanner again.
  // }

  async continueScanning(): Promise<void> {
    this.isCameraVisible = false;
    // Use setTimeout to allow Angular to update the template properly
    await Promise.resolve().then(() => {
      this.isCameraVisible = true;
      this.scanner.reset();
      this.scanner.scanStart();
    });
  }
  
  onCamerasFound(availableDevices: MediaDeviceInfo[]) {
    console.log('Available cameras:', availableDevices);
  }
  

  onScanSuccess(data: any) {
    // Search for the QR code content in your database
    // this.scanner.codeReader.reset();
    this.scanner.reset();
    this.db.database.ref('qrcodes').orderByChild('data').equalTo(data).once('value', async snapshot => {
      let alertHeader = '';
      let alertMessage = '';
      let alertSubHeader = '';
      
      if (snapshot.exists()) {
        // If found in the database
        alertHeader = '✅ Success';
        alertSubHeader = `Content: ${data}`;
        alertMessage = `It is in our database as it was generated with our app!`;
      } else {
        // If not found in the database
        alertHeader = '❌ Warning';
        alertSubHeader = `Content: ${data}`;
        alertMessage = `It is not in our database, therefore it was not created using our app!`;
      }
  
      // Show alert message based on the result
      const alert = await this.alertController.create({
        header: alertHeader,
        subHeader: alertSubHeader,
        message: alertMessage,
        buttons: [{
          text: 'OK',
          handler: async () => {
            await alert.dismiss();
            this.continueScanning();
            this.changeDetector.detectChanges();
          }
        }]
      });
  
      await alert.present();
    });
  }
  


// Old working code
  // onScanSuccess(decodedText: string){
  // this.qrGeneratorService.checkIfQrCodeExists(decodedText).subscribe(isStored => {
  // // your logic to show checkmark or cross based on isStored value
  //   let header = isStored ? 'Success' : 'Info';
  //   let message = isStored ? 'QR code found and valid!' : `QR code not found or invalid. Content: ${decodedText}`;
  //   this.presentAlert(header, message);
  // });
  // }

  // async presentAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header: header,
  //     message: message,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }

}
