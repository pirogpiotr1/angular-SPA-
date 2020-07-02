import { TestBed } from '@angular/core/testing';

import { HistoryResultsService } from './history-results.service';

describe('HistoryResultsService', () => {
  let service: HistoryResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
