import { TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordOtpValidationService } from './rgtr-forgot-password-otp-validation.service';

describe('RgtrForgotPasswordOtpValidationService', () => {
  let service: RgtrForgotPasswordOtpValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RgtrForgotPasswordOtpValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
