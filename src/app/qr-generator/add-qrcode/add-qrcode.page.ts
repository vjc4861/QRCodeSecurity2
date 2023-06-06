import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-qrcode',
  templateUrl: './add-qrcode.page.html',
  styleUrls: ['./add-qrcode.page.scss'],
})
export class AddQrcodePage implements OnInit {


  form!: FormGroup;
  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      qrData: new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required ]
      }),
      errorCorrection: new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required ]
      }),
      size: new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(200) ]
      }),

    })
  }


  generateQRCode(){
    console.log("QR Code is Generated")
  }

  storeData(){
    console.log("QR code is stored in the database")
  }
}
