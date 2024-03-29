import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { QrGeneratorService } from '../qr-generator/qr-generator.service';
import { BarcodeFormat } from '@zxing/library';
import { AlertController, ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { QrVerificationPopupPage } from './qr-verification-popup/qr-verification-popup.page';


@Component({
  selector: 'app-qr-verification',
  templateUrl: './qr-verification.page.html',
  styleUrls: ['./qr-verification.page.scss'],
})
export class QrVerificationPage implements OnInit {
  
  

  constructor(private ngZone: NgZone, private elementRef: ElementRef, private modalController: ModalController, private http: HttpClient, private changeDetector: ChangeDetectorRef ,private qrGeneratorService: QrGeneratorService, private alertController: AlertController, private db: AngularFireDatabase) { }

  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;


  qrcodeFormat = BarcodeFormat.QR_CODE;
  // isCameraVisible = true;

  ngOnInit() {
  }

  async openQrVerificationPopup() {
    const modal = await this.modalController.create({
      component: QrVerificationPopupPage,
      componentProps: {
        'title': 'QR Verification Title',      
        'lines': ['Line1', 'Line2', 'Line3'],  
      },
      backdropDismiss: false
    });
    
    return await modal.present();
  }

  async continueScanning(): Promise<void> {
    this.scanner.enable = false;
    // this.isCameraVisible = false;
    await Promise.resolve().then(() => {
      this.scanner.enable = true;
      // this.isCameraVisible = true;
      this.scanner.reset();
      this.scanner.scanStart();
    });
  }

  // async continueScanning(): Promise<void> {
  //   this.ngZone.run(() => {
  //     this.isCameraVisible = false;
  //     setTimeout(() => {
  //       this.isCameraVisible = true;
  //       this.scanner.reset();
  //       this.scanner.scanStart();
  //     });
  //   });
  // }
  

  verifyURLSafety(url: string): Observable<boolean> {
    const apiUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
    const apiKey = 'AIzaSyAOE_SXO529nSe5Lu6ASUBcd7MiH9AiA9w'; 
 
    const payload = {
      client: { clientId: '', clientVersion: '1.0' },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{url: url}]
      }
    };
    
    return new Observable<boolean>(observer => {
        this.http.post(apiUrl + '?key=' + apiKey, payload).subscribe(
            response => {
                console.log('Response from Google Safe Browsing API:', response);
                const isURLSafe = !('matches' in response);
                observer.next(isURLSafe);
                observer.complete();
            },
            error => {
                console.error('Error verifying URL safety:', error);
                observer.error(error);
            }
        );
    });
}

  // expandUrl(shortUrl: string): Observable<string> {
  //   return this.http.get(shortUrl, {
  //     observe: 'response',
  //     responseType: 'text'
  //   }).pipe(map((response: HttpResponse<string>) => {
  //     return response.headers.get('location') || shortUrl;
  //   }));
  // }



  
  onCamerasFound(availableDevices: MediaDeviceInfo[]) {
    console.log('Available cameras:', availableDevices);
  }
  
  onScanSuccess(data: any) {
    this.ngZone.runOutsideAngular(() => { 
    // this.scanner.enable = false;
      this.scanner.reset();
    
      // Initialise modal variables
      let modalHeader = '';
      let modalLines = ['', '', ''];
    
      // Check if the URL is HTTP or HTTPS
      let httpOrHttps = '';
      try {
        const url = new URL(data);
        if (url.protocol === 'https:') {
          httpOrHttps = '✅ The URL uses secure protocol.';
        } else if (url.protocol === 'http:') {
          httpOrHttps = '❌ The URL does not use secure protocol.';
        } else {
          httpOrHttps = '🔴 The URL does not use HTTP or HTTPS protocol.';
        }
      } catch (error) {
        httpOrHttps = '🔴 The QR code does not contain a valid URL.';
      }

      this.verifyURLSafety(data).subscribe(
        isURLSafe => {
          console.log("Safe or not:", isURLSafe);
    
          this.db.database.ref('qrcodes').orderByChild('data').equalTo(data).once('value', async snapshot => {
            // The URL safety result is being declared here regardless of whether the snapshot exists in the database
            let safetyResult = isURLSafe ? '✅ The URL is safe.' : '❌ The URL is unsafe.';
      
            if (snapshot.exists()) {
              // If found in the database
              modalHeader = '✅ Success';
              modalLines[0] = `Content: ${data}`;
              modalLines[1] = ``;
              modalLines[2] = `✅ It is in our database as it was generated with our app!`;
              modalLines[3] = `${safetyResult}`;
              modalLines[4] = `${httpOrHttps}`;
            } else {
              // If not found in the database
              modalHeader = '❌ Warning';
              modalLines[0] = `Content: ${data}`;
              modalLines[1] = ``;
              modalLines[2] = `❌ It is not in our database, therefore it was not created using our app!`;
              modalLines[3] = `${safetyResult}`;
              modalLines[4] = `${httpOrHttps}`;
            }
    
            // Show modal message based on the result
            
            const modal = await this.modalController.create({
              component: QrVerificationPopupPage,
              componentProps: {
                title: modalHeader,
                lines: modalLines,
              },
              cssClass: 'verificationModal' // Using the class defined in qr-verification-popup.page.scss
            });
            
    
            modal.onDidDismiss().then(dataReturned => {
              if (dataReturned !== null) {
                this.scanner.enable = true;
                this.continueScanning();
                this.changeDetector.detectChanges();
              }
            });
        
            return await modal.present();
          });
        },
        error => {
          console.error('Error verifying URL safety:', error);
        }
      );
      }    
    )};
}


