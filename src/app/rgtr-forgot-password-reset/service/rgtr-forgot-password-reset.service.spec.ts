import { TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordResetService } from './rgtr-forgot-password-reset.service';

describe('RgtrForgotPasswordResetService', () => {
  let service: RgtrForgotPasswordResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RgtrForgotPasswordResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
