import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordResetComponent } from './rgtr-forgot-password-reset.component';

describe('RgtrForgotPasswordResetComponent', () => {
  let component: RgtrForgotPasswordResetComponent;
  let fixture: ComponentFixture<RgtrForgotPasswordResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrForgotPasswordResetComponent]
    });
    fixture = TestBed.createComponent(RgtrForgotPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
