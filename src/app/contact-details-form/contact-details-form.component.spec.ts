import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailsFormComponent } from './contact-details-form.component';

describe('ContactDetailsFormComponent', () => {
  let component: ContactDetailsFormComponent;
  let fixture: ComponentFixture<ContactDetailsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactDetailsFormComponent]
    });
    fixture = TestBed.createComponent(ContactDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
