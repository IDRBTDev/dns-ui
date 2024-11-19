import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainInvoicesComponent } from './domain-invoices.component';

describe('DomainInvoicesComponent', () => {
  let component: DomainInvoicesComponent;
  let fixture: ComponentFixture<DomainInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainInvoicesComponent]
    });
    fixture = TestBed.createComponent(DomainInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
