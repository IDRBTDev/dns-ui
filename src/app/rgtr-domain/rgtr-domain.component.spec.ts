import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgtrDomainComponent } from './rgtr-domain.component';

describe('RgtrDomainComponent', () => {
  let component: RgtrDomainComponent;
  let fixture: ComponentFixture<RgtrDomainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgtrDomainComponent]
    });
    fixture = TestBed.createComponent(RgtrDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
