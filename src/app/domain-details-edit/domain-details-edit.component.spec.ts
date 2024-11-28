import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainDetailsEditComponent } from './domain-details-edit.component';

describe('DomainDetailsEditComponent', () => {
  let component: DomainDetailsEditComponent;
  let fixture: ComponentFixture<DomainDetailsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DomainDetailsEditComponent]
    });
    fixture = TestBed.createComponent(DomainDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
