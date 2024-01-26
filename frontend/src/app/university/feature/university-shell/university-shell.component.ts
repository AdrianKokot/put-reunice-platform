import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page, PageService } from '@eunice/modules/shared/data-access';
import {
  combineLatest,
  distinctUntilKeyChanged,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs';
import {
  nestedRouteParamMap,
  resourceIdFromRoute,
} from '@eunice/modules/shared/util';
import { SideService } from '../../../shared/side.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  PageMapItem,
  UNIVERSITY_PAGE_HIERARCHY,
  UNIVERSITY_PAGE_HIERARCHY_MAP,
  UniversityPagesTreeComponent,
} from '../../ui/university-pages-tree/university-pages-tree.component';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { TuiLinkModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'eunice-university-shell',
  standalone: true,
  imports: [
    CommonModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    RouterModule,
    TuiLetModule,
  ],
  templateUrl: './university-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityShellComponent implements OnDestroy {
  private readonly _pageService = inject(PageService);
  private readonly _sideService = inject(SideService);
  private readonly _injector = inject(Injector);

  private readonly _universityId$ = resourceIdFromRoute();
  private readonly _pageId$ = nestedRouteParamMap('pageId');

  private readonly _pagesMap = new Map<Page['id'], PageMapItem>();

  public readonly pages$ = this._universityId$.pipe(
    switchMap((id) =>
      this._pageService
        .getUniversityHierarchy(Number(id))
        .pipe(startWith(null)),
    ),
    map((pages) => {
      if (pages === null) return pages;

      const addPageToMap = (page: Page, parentId: Page['id'] | null = null) => {
        this._pagesMap.set(page.id, {
          id: page.id,
          title: page.title,
          parentId,
        });
        page.children.forEach((p) => addPageToMap(p, page.id));
      };

      addPageToMap(pages);

      this._sideService.setLeftSide(
        new PolymorpheusComponent(
          UniversityPagesTreeComponent,
          Injector.create({
            parent: this._injector,
            providers: [
              {
                provide: UNIVERSITY_PAGE_HIERARCHY,
                useValue: pages,
              },
              {
                provide: UNIVERSITY_PAGE_HIERARCHY_MAP,
                useValue: this._pagesMap,
              },
            ],
          }),
        ),
      );

      return pages;
    }),
  );

  readonly breadcrumbs$ = combineLatest({
    page: this.pages$.pipe(filter((x) => x !== null)),
    pageId: this._pageId$,
  }).pipe(
    distinctUntilKeyChanged('pageId'),
    map(({ pageId }) => {
      const breadcrumbs: Array<Pick<Page, 'id' | 'title'>> = [];

      let currentId: number | null = Number(pageId);
      while (currentId) {
        const page = this._pagesMap.get(currentId);
        if (!page) {
          break;
        }

        breadcrumbs.unshift({ id: currentId, title: page.title });
        currentId = page.parentId;
      }

      return breadcrumbs.length < 2 ? [] : breadcrumbs;
    }),
    startWith(null),
  );

  ngOnDestroy(): void {
    this._sideService.setLeftSide(null);
  }

  constructor() {
    this._sideService.setLeftSide('');
  }
}
