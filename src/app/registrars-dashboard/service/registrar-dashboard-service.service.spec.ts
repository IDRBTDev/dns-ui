import { TestBed } from '@angular/core/testing';

import { RegistrarDashboardServiceService } from './registrar-dashboard-service.service';

describe('RegistrarDashboardServiceService', () => {
  let service: RegistrarDashboardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarDashboardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
