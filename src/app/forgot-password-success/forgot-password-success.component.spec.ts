import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSuccessComponent } from './forgot-password-success.component';

describe('ForgotPasswordSuccessComponent', () => {
  let component: ForgotPasswordSuccessComponent;
  let fixture: ComponentFixture<ForgotPasswordSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordSuccessComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
