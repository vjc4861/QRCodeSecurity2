import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { QrVerificationPopupPage } from './qr-verification-popup.page';

describe('QrVerificationPopupPage', () => {
  let component: QrVerificationPopupPage;
  let fixture: ComponentFixture<QrVerificationPopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QrVerificationPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
