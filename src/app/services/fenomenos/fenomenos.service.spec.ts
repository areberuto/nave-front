import { TestBed } from '@angular/core/testing';

import { FenomenosService } from './fenomenos.service';

describe('FenomenosService', () => {
  let service: FenomenosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FenomenosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
