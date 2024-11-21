import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainInvoiceDetailsComponent } from './domain-invoice-details.component';

describe('DomainInvoiceDetailsComponent', () => {
  let component: DomainInvoiceDetailsComponent;
  let fixture: ComponentFixture<DomainInvoiceDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainInvoiceDetailsComponent]
    });
    fixture = TestBed.createComponent(DomainInvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
