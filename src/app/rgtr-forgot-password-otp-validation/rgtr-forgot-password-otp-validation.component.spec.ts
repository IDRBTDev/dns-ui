import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordOtpValidationComponent } from './rgtr-forgot-password-otp-validation.component';

describe('RgtrForgotPasswordOtpValidationComponent', () => {
  let component: RgtrForgotPasswordOtpValidationComponent;
  let fixture: ComponentFixture<RgtrForgotPasswordOtpValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrForgotPasswordOtpValidationComponent]
    });
    fixture = TestBed.createComponent(RgtrForgotPasswordOtpValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
