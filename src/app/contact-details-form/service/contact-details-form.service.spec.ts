import { TestBed } from '@angular/core/testing';

import { ContactDetailsFormService } from './contact-details-form.service';

describe('ContactDetailsFormService', () => {
  let service: ContactDetailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactDetailsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
