import { Injectable } from '@angular/core';
import { qrCode_model } from './qr-generator.model';
import { QRCodeErrorCorrectionLevel } from "qrcode";
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, take, map, tap, delay, Observable, from, catchError, of, switchMap, Subject, filter, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class QrGeneratorService {

  public _qrcodes = new BehaviorSubject<qrCode_model[]>([ ]) ; 
  private deletedQrCodeId = new BehaviorSubject<string | null>(null);
  qrCodeDeleted$ = this.deletedQrCodeId.asObservable(); 
  userId: any;

  

  get qrcodes() {
    // return [...this._qrcode];
    return this._qrcodes.asObservable();
  }

  getQrcode(id: any){
    return this.qrcodes.pipe(take(1), map(qrcodes => {
      return {...qrcodes.find(qr => qr.qid === id)};
    }));
    
  }

  addingQrCode(qrCode: qrCode_model) {
    this._qrcodes.pipe(take(1)).subscribe(qrcodes => {
      this._qrcodes.next([...qrcodes, qrCode]);
    });
  }

  // addingQrCode(qrCode: qrCode_model) {
  //   return this._qrcodes.pipe(take(1), tap(qrcodes => {
  //     this._qrcodes.next(qrcodes.concat(qrCode));
  //     localStorage.setItem('loadedQr', JSON.stringify(qrcodes.concat(qrCode)));
  //   })).subscribe();
  // }
  
  // addingQrCode(qrCode: qrCode_model){
  //   return this._qrcodes.pipe(take(1), tap(qrcodes => {
  //     this._qrcodes.next(qrcodes.concat(qrCode));
  //   })).subscribe();
  // }

  // qrCodeDeleted$ = this.deletedQrCodeId.pipe(
  //   filter(id => !!id)
  // );

  

  constructor(private loadingEl:LoadingController  ,public authService: AuthService,  private db: AngularFireDatabase, private db2: AngularFirestore) { 
    // console.log("work ")
    // this.fetchDatafromDb()
    this.authService.userisAuthenticated.subscribe(isAuth => {
      if (!isAuth) {
        console.log("User is not authenticated!");
      } else {
        this.userId = this.userId;
        this.fetchDatafromDb().subscribe(qrcodes => {
          this._qrcodes.next(qrcodes);
        });
      }
    });
  
  }

    // fetchDatafromDb(): Observable<any> {
    //   console.log('fetchDatafromDb called');
    //   return this.authService.userId.pipe(
    //     take(1),
    //     switchMap((userId) => {
    //       if (userId) {
    //         // return this.db.list('qrcodes').valueChanges().pipe(
    //           return this.db.list('qrcodes', ref => ref.orderByChild('userId').equalTo(userId)).valueChanges().pipe(
    //           map((data: any) => {
    //             console.log("This fetch function is working");
    //             console.log(JSON.stringify(data));
    //             const qrcodes: qrCode_model[] = [];
    //             for (let key in data) {
    //                 const qruuid = data[key].qruuid;
    //                 const qrUserId = data[key].userId;
    //                 // Check if user ID matches the current user ID
    //                 if (qrUserId === userId) {
    //                   const qrTitle = data[key].title;
    //                   const qrData = data[key].data;
    //                   const width = data[key].width;
    //                   const errorCorrectionLevel = data[key].errorCorrectionLevel;
                      
    //                   const newQrCode = new qrCode_model(
    //                     qruuid,
    //                     Math.random().toString(),
    //                     qrTitle,
    //                     qrData,
    //                     width,
    //                     errorCorrectionLevel,
    //                     userId
    //                   );
    //                   qrcodes.push(newQrCode);
    //                 }
    //             }
    //             return qrcodes;
    //           })
    //         );
    //       } else {
    //         return throwError('User not logged in');
    //       }
    //     })
    //   );
    // }
    

    fetchDatafromDb(): Observable<any> {
      return this.authService.userId.pipe(
        take(1),
        switchMap((userId) => {
          if (userId) {
            return this.db
              .list('qrcodes', (ref) => ref.orderByChild('userId').equalTo(userId))
              // .object('qrcodes')
              .valueChanges()
              .pipe(
                map((data: any) => {
                  console.log("This fetch function is working");
                  console.log(JSON.stringify(data));
                  const qrcodes: qrCode_model[] = [];
                  for (let key in data) {
                      const qruuid = data[key].qruuid;
                    // if (qruuid === userId) {
                      const qrTitle = data[key].title;
                      const qrData = data[key].data;
                      const width = data[key].width;
                      const errorCorrectionLevel = data[key].errorCorrectionLevel;
                      const qrUserId = data[key].userId;
                      console.log(qrTitle);
                      
                      const newQrCode = new qrCode_model(
                        qruuid,
                        Math.random().toString(),
                        qrTitle,
                        qrData,
                        width,
                        errorCorrectionLevel,
                        userId
                      );
                      qrcodes.push(newQrCode);
                    // }
                }
                  return qrcodes;
                })
              );
          } else {
            return throwError('User not logged in');
          }
        })
      );
    }

    fetchQrcode(uuid: string, qrTitle: string, qrData: string, width: number, errorCorrectionLevel: QRCodeErrorCorrectionLevel) {
      this.authService.userId.pipe(take(1)).subscribe(userId => {
        if (userId === null) {
          console.warn('User ID is null; cannot fetch QR code');
          return;
        }
    
        const newQrCode = new qrCode_model(uuid, Math.random().toString(), qrTitle, qrData, width, errorCorrectionLevel, userId);
        this._qrcodes.pipe(take(1), tap(qrcodes => {
          this._qrcodes.next(qrcodes.concat(newQrCode));
        })).subscribe();
      });
    }

  

  deleteQrCode(qrcodeId: string) {
    return this._qrcodes.pipe(take(1), tap(qrcodes => {
      this._qrcodes.next(qrcodes.filter(qr => qr.qid !== qrcodeId));
    })).subscribe();
  }

  cancelQrcode(qrcodeId: string): Observable<void | null> {
    const path = 'qrcodes';
    console.log(path);
    return this.db.object(path).valueChanges().pipe(
      take(1),
      switchMap((codes: any) => {
        for (let key in codes) {
          console.log(key);
          console.log(codes);
          const qruuid = codes[key].qruuid;
          console.log(qruuid);
          console.log(qrcodeId);
          if (qruuid === qrcodeId) {
            console.log("removing......");
            this.db.object(path + '/' + key).remove().then(() => {
              this._qrcodes.pipe(take(1), tap(qrcodes => {
                this._qrcodes.next(qrcodes.filter(qr => qr.qruuid !== qrcodeId));
                localStorage.setItem('loadedQr', JSON.stringify(qrcodes.filter(qr => qr.qruuid !== qrcodeId)));
              })).subscribe();
            });

            setTimeout(() => {
              this.loadingEl.dismiss()
            }, 500);

            return of<void>();
          }
        }
        return of(null);
      }),
    );
  }
  

  checkIfQrCodeExists(code: string): Observable<boolean> {
    // Set a unique identifier that is used to identify QR codes generated by your app.
    const uniqueIdentifier = 'your_unique_identifier_';
  
    // Check if the scanned code contains the unique identifier.
    if (code.startsWith(uniqueIdentifier)) {
      return this.db.object('qrcodes').valueChanges().pipe(
        map((data: any) => {
          // Check the existence of the QR code in the database by finding its unique identifier
          for (let key in data) {
            const qruuid = data[key].qruuid;
            const fullUniqueIdentifier = uniqueIdentifier + qruuid;
            if (code === fullUniqueIdentifier) {
              return true;
            }
          }
          return false;
        }));
    } else {
      return of(false);
    }
  }  

}

// Old working codes of fetchQrcode() and fetchDatafromDb()

// fetchDatafromDb(): Observable<any> {
    //   return this.db.object('qrcodes').valueChanges().pipe(map((data: any) => {
    //     console.log("This fetch function is working")
    //     console.log(JSON.stringify(data))
    //     const qrcodes: qrCode_model[] = [];
    //     for(let key in data){
    //       const qruuid = data[key].qruuid;
    //       const qrTitle = data[key].title;
    //       const qrData = data[key].data;
    //       const width = data[key].width;
    //       const errorCorrectionLevel = data[key].errorCorrectionLevel;
    //       console.log(qrTitle);
    
    //       const newQrCode = new qrCode_model(qruuid, Math.random().toString(), qrTitle, qrData, width, errorCorrectionLevel, this.authService.userId);
    //       qrcodes.push(newQrCode);
    //     }
    //     return qrcodes;
    //   }));
    // }
// fetchQrcode(uuid: string, qrTitle:string, qrData:string, width:number, errorCorrectionLevel:QRCodeErrorCorrectionLevel ){
  //   const newQrCode = new qrCode_model(uuid, Math.random().toString(), qrTitle, qrData, width, errorCorrectionLevel,this.authService.userId);
  //   // this._qrcode.push(newQrCode)
  //   return this._qrcodes.pipe(take(1), tap(qrcodes => {
  //       this._qrcodes.next(qrcodes.concat(newQrCode));
  //   })).subscribe();
    
  // }


//Old onCancelMethod() active until 05/08/2023
// cancelQrcode(qrcodeId: string): Observable<void | null> {
//   const path = 'qrcodes';
//   console.log(path)
//   return this.db.object(path).valueChanges().pipe(
//     take(1),
//     switchMap((codes: any) => {
//       for (let key in codes) {
//         console.log(key);
//         console.log(codes);
//         const qruuid = codes[key].qruuid;
//         console.log(qruuid);
//         console.log(qrcodeId);
//         if (qruuid === qrcodeId) {
//           console.log("removing......");
//           this.db.object(path + '/' + key).remove().then(() => {
//             this.deletedQrCodeId.next(qrcodeId);
//           });

//           setTimeout(() => {
//             this.loadingEl.dismiss()
//           }, 500);

//           return of<void>();
//         }
//       }
//       return of(null);
//     }),
//   );
// }
// fetchDatafromDb(){
  //   this.db.object('qrcodes').valueChanges().subscribe((data: any) => {
  //     // extract the required data
  //     console.log("This fetch function is working")
  //     console.log(JSON.stringify(data))
  //     for(let key in data){
  //       const qruuid = data[key].qruuid;
  //       const qrTitle = data[key].title;
  //       const qrData = data[key].data;
  //       const width = data[key].width;
  //       const errorCorrectionLevel = data[key].errorCorrectionLevel;
  //       console.log(qrTitle);
    
  //     // call your function with the extracted data
  //     this.fetchQrcode(qruuid, qrTitle, qrData, width, errorCorrectionLevel);
  //     }
  //   });
  // }
  // cancelQrcode(qrcodeId: string){
  //   this.db.object('qrcodes').remove()
  // }

  
  
  // cancelQrcode(qrcodeId: string){
  //   return this.qrcodes.pipe(take(1), tap(qrcodes => {
  //     this._qrcodes.next(qrcodes.filter(qr => qr.qid !== qrcodeId));
      
  // }));

  // }



// cancelQrcode(qrcodeId: string){
//   const uuid = qrcodeId.replace(/[.#$[\]]/g, '_'); // replace special characters with underscore
//   const path = `qrcodes/${uuid}`;
//   return from(this.db.object(path).remove()).pipe(
//     catchError(error => {
//       console.error('Error deleting qrcode:', error);
//       return of(null);
//     })
//   );
// }
// new qrCode_model(
//   '',
//   '001',
//   'Greetings QR SEC',
//   'Welcome to QR Security', 
//   300, 
//   'H',
//   'stark',),
  

// new qrCode_model(
//   '',
//   '002',
//   'Greeting Tony',
//   'Welcome to Tony Stark', 
//   400, 
//   'M',
//   'stark',),
// new qrCode_model(
//   '',
//   '003',
//   'Grateful to Jarvis',
//   'Thank you Jarvis', 
//   350, 
//   'Q',
//   'stark',),