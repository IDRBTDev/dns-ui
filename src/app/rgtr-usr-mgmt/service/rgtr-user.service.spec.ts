import { TestBed } from '@angular/core/testing';

import { RgtrUserService } from './rgtr-user.service';

describe('RgtrUserService', () => {
  let service: RgtrUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RgtrUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
