import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DscVerificationComponent } from './dsc-verification.component';

describe('DscVerificationComponent', () => {
  let component: DscVerificationComponent;
  let fixture: ComponentFixture<DscVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DscVerificationComponent]
    });
    fixture = TestBed.createComponent(DscVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
