import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrantUserManagementComponent } from './rgtr-rgnt-officer-details.component';

describe('RegistrantUserManagementComponent', () => {
  let component: RegistrantUserManagementComponent;
  let fixture: ComponentFixture<RegistrantUserManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrantUserManagementComponent]
    });
    fixture = TestBed.createComponent(RegistrantUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
