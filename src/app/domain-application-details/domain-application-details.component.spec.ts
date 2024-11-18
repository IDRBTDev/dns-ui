import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainApplicationDetailsComponent } from './domain-application-details.component';

describe('DomainApplicationDetailsComponent', () => {
  let component: DomainApplicationDetailsComponent;
  let fixture: ComponentFixture<DomainApplicationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainApplicationDetailsComponent]
    });
    fixture = TestBed.createComponent(DomainApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
