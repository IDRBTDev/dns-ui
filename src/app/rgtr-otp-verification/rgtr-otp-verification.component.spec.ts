import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrOtpVerificationComponent } from './rgtr-otp-verification.component';

describe('RgtrOtpVerificationComponent', () => {
  let component: RgtrOtpVerificationComponent;
  let fixture: ComponentFixture<RgtrOtpVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrOtpVerificationComponent]
    });
    fixture = TestBed.createComponent(RgtrOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
