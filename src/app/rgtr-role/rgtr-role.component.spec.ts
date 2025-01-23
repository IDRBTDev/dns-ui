import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrRoleComponent } from './rgtr-role.component';

describe('RgtrRoleComponent', () => {
  let component: RgtrRoleComponent;
  let fixture: ComponentFixture<RgtrRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrRoleComponent]
    });
    fixture = TestBed.createComponent(RgtrRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
