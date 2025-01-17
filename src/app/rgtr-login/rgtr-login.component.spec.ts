import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrLoginComponent } from './rgtr-login.component';

describe('RgtrLoginComponent', () => {
  let component: RgtrLoginComponent;
  let fixture: ComponentFixture<RgtrLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrLoginComponent]
    });
    fixture = TestBed.createComponent(RgtrLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
