import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { qrCode_model } from './qr-generator.model';
import { QrGeneratorService } from './qr-generator.service';

@Injectable({ providedIn: 'root' })
export class QrCodeFetcherGuard implements Resolve<qrCode_model[]> {
  constructor(private qrGeneratorService: QrGeneratorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<qrCode_model[]> {
    return this.qrGeneratorService.qrcodes;
  }

}
