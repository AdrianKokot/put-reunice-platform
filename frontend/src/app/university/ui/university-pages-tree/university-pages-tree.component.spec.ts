import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  PageMapItem,
  UNIVERSITY_PAGE_HIERARCHY,
  UNIVERSITY_PAGE_HIERARCHY_MAP,
  UniversityPagesTreeComponent,
} from './university-pages-tree.component';
import { TestingModule } from '@eunice/testing';
import { Page } from '@eunice/modules/shared/data-access';

describe(UniversityPagesTreeComponent.name, () => {
  let component: UniversityPagesTreeComponent;
  let fixture: ComponentFixture<UniversityPagesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: UNIVERSITY_PAGE_HIERARCHY,
          useValue: {
            id: 1,
            parent: null,
            title: 'TEST',
            children: [] as Page[],
          },
        },
        {
          provide: UNIVERSITY_PAGE_HIERARCHY_MAP,
          useValue: new Map<Page['id'], PageMapItem>(),
        },
      ],
      imports: [TestingModule, UniversityPagesTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityPagesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
