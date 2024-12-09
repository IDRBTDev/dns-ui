import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrUsrMgmtComponent } from './rgtr-usr-mgmt.component';

describe('RgtrUsrMgmtComponent', () => {
  let component: RgtrUsrMgmtComponent;
  let fixture: ComponentFixture<RgtrUsrMgmtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrUsrMgmtComponent]
    });
    fixture = TestBed.createComponent(RgtrUsrMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
