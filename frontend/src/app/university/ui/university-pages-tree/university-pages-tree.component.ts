import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  TrackByFunction,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  nestedRouteParamMap,
  PAGE_TREE_HANDLER,
} from '@reunice/modules/shared/util';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiLinkModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiTreeModule } from '@taiga-ui/kit';
import { Page } from '@reunice/modules/shared/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, first, map } from 'rxjs';

export const UNIVERSITY_PAGE_HIERARCHY = new InjectionToken<Page>(
  'UNIVERSITY_PAGE_HIERARCHY',
);

export type PageMapItem = Pick<Page, 'id' | 'title'> & {
  parentId: Page['id'] | null;
};
export const UNIVERSITY_PAGE_HIERARCHY_MAP = new InjectionToken<
  Map<Page['id'], PageMapItem>
>('UNIVERSITY_PAGE_HIERARCHY_MAP');

@Component({
  selector: 'reunice-university-pages-tree',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    TuiLinkModule,
    TuiTreeModule,
    RouterLink,
    TuiScrollbarModule,
  ],
  templateUrl: './university-pages-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./university-pages-tree.component.scss'],
})
export class UniversityPagesTreeComponent {
  readonly page = inject(UNIVERSITY_PAGE_HIERARCHY, { optional: true });
  private readonly _pageMap = inject(UNIVERSITY_PAGE_HIERARCHY_MAP, {
    optional: true,
  });

  readonly handler = PAGE_TREE_HANDLER;
  readonly trackById: TrackByFunction<Page> = (_, item: Page) => item.id;
  readonly map = new Map<Page, boolean>();

  constructor() {
    nestedRouteParamMap('pageId')
      .pipe(
        takeUntilDestroyed(),
        map((id) => Number(id)),
        filter((id): id is number => id !== null),
        first(),
      )
      .subscribe((pageId) => {
        const stepsArray: number[] = [];
        let page = this._pageMap?.get(pageId);
        while (page) {
          stepsArray.unshift(page.id);
          page = page.parentId ? this._pageMap?.get(page.parentId) : undefined;
        }

        stepsArray.shift();
        let root = this.page;
        if (root) this.map.set(root, true);
        while (root && stepsArray.length > 0) {
          this.map.set(root, true);
          const id = stepsArray.shift();
          root = root?.children?.find((child) => child.id === id) ?? null;
        }
      });
  }
}
