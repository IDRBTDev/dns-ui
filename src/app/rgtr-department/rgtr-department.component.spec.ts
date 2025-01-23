import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrDepartmentComponent } from './rgtr-department.component';

describe('RgtrDepartmentComponent', () => {
  let component: RgtrDepartmentComponent;
  let fixture: ComponentFixture<RgtrDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrDepartmentComponent]
    });
    fixture = TestBed.createComponent(RgtrDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
