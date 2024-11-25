import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDocumentUploadComponent } from './contact-document-upload.component';

describe('ContactDocumentUploadComponent', () => {
  let component: ContactDocumentUploadComponent;
  let fixture: ComponentFixture<ContactDocumentUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactDocumentUploadComponent]
    });
    fixture = TestBed.createComponent(ContactDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
