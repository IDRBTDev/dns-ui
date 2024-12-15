import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgntDomainApplicationDetailsComponent } from './rgnt-domain-application-details.component';

describe('RgntDomainApplicationDetailsComponent', () => {
  let component: RgntDomainApplicationDetailsComponent;
  let fixture: ComponentFixture<RgntDomainApplicationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RgntDomainApplicationDetailsComponent]
    });
    fixture = TestBed.createComponent(RgntDomainApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
