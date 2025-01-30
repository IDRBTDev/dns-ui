import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrForgotPasswordSuccessComponent } from './rgtr-forgot-password-success.component';

describe('RgtrForgotPasswordSuccessComponent', () => {
  let component: RgtrForgotPasswordSuccessComponent;
  let fixture: ComponentFixture<RgtrForgotPasswordSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrForgotPasswordSuccessComponent]
    });
    fixture = TestBed.createComponent(RgtrForgotPasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
