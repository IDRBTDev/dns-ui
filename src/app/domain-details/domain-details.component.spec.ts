import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainDetailsComponent } from './domain-details.component';

describe('DomainDetailsComponent', () => {
  let component: DomainDetailsComponent;
  let fixture: ComponentFixture<DomainDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainDetailsComponent]
    });
    fixture = TestBed.createComponent(DomainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
