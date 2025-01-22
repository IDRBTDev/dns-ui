import { TestBed } from '@angular/core/testing';

import { RgtrRoleService } from './rgtr-role.service';

describe('RgtrRoleService', () => {
  let service: RgtrRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RgtrRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
