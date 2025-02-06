import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrRgntUserMgmtComponent } from './rgtr-rgnt-usr-mgmt.component';

describe('UserComponent', () => {
  let component: RgtrRgntUserMgmtComponent;
  let fixture: ComponentFixture<RgtrRgntUserMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrRgntUserMgmtComponent]
    });
    fixture = TestBed.createComponent(RgtrRgntUserMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
