import { TestBed } from '@angular/core/testing';

import { NameServerService } from './name-server.service';

describe('NameServerService', () => {
  let service: NameServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NameServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
