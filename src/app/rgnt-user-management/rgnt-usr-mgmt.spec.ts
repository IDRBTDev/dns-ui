import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgntUserManagementComponent } from './rgnt-usr-mgmt.component';

describe('RgntUserManagementComponent', () => {
  let component: RgntUserManagementComponent;
  let fixture: ComponentFixture<RgntUserManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgntUserManagementComponent]
    });
    fixture = TestBed.createComponent(RgntUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
