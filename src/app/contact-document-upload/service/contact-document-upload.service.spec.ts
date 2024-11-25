import { TestBed } from '@angular/core/testing';

import { ContactDocumentUploadService } from './contact-document-upload.service';

describe('ContactDocumentUploadService', () => {
  let service: ContactDocumentUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactDocumentUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
