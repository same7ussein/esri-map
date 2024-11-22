import { TestBed } from '@angular/core/testing';

import { FlowbiteService } from './flowbite-service.service';

describe('FlowbiteServiceService', () => {
  let service: FlowbiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowbiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
