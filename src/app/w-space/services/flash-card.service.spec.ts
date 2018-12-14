import { TestBed } from '@angular/core/testing';

import { FlashCardService } from './flash-card.service';

describe('FlashCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlashCardService = TestBed.get(FlashCardService);
    expect(service).toBeTruthy();
  });
});
