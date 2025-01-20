import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgntOtpVerificationComponent } from './rgnt-otp-verification.component';

describe('RgntOtpVerificationComponent', () => {
  let component: RgntOtpVerificationComponent;
  let fixture: ComponentFixture<RgntOtpVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgntOtpVerificationComponent]
    });
    fixture = TestBed.createComponent(RgntOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
