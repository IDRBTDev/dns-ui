import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordEmailVerificationComponent } from './rgtr-forgot-password-email-verification.component';

describe('RgtrForgotPasswordEmailVerificationComponent', () => {
  let component: RgtrForgotPasswordEmailVerificationComponent;
  let fixture: ComponentFixture<RgtrForgotPasswordEmailVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrForgotPasswordEmailVerificationComponent]
    });
    fixture = TestBed.createComponent(RgtrForgotPasswordEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
