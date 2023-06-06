import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  private imageQrSource = new BehaviorSubject<string | null>(null);
  currentQrImage = this.imageQrSource.asObservable();

  constructor() { }

  changeQrImage(image: string){
    this.imageQrSource.next(image);
  }
}
