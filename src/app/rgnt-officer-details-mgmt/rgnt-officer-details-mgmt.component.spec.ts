import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficerDetailsManagementComponent } from './rgnt-officer-details-mgmt.component';

describe('OfficerDetailsManagementComponent', () => {
  let component: OfficerDetailsManagementComponent;
  let fixture: ComponentFixture<OfficerDetailsManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfficerDetailsManagementComponent]
    });
    fixture = TestBed.createComponent(OfficerDetailsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
