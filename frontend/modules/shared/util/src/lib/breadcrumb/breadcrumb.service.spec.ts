import { TestBed } from '@angular/core/testing';

import { BreadcrumbService } from './breadcrumb.service';
import { TestingModule } from '@reunice/testing';

describe(BreadcrumbService.name, () => {
  let service: BreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestingModule] });
    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
