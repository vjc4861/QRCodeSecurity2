import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';





@Component({
  selector: 'app-qr-verification-popup',
  templateUrl: './qr-verification-popup.page.html',
  styleUrls: ['./qr-verification-popup.page.scss'],
})
export class QrVerificationPopupPage implements OnInit {

  @Input() title?: string;
  @Input() lines?: string[];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

}
