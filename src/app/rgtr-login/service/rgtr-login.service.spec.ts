import { TestBed } from '@angular/core/testing';

import { RgtrLoginService } from './rgtr-login.service';

describe('RgtrLoginService', () => {
  let service: RgtrLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RgtrLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
