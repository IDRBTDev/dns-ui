import { TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordEmailVerificationService } from './rgtr-forgot-password-email-verification.service';

describe('RgtrForgotPasswordEmailVerificationService', () => {
  let service: RgtrForgotPasswordEmailVerificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RgtrForgotPasswordEmailVerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
