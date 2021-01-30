import {TestBed} from '@angular/core/testing';

import {AccessControlService} from './access-control.service';

describe('AccessControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessControlService = TestBed.get(AccessControlService);
    expect(service).toBeTruthy();
  });
});
