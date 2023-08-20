import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PAGE_TREE_HANDLER } from '@reunice/modules/shared/util';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiTreeModule } from '@taiga-ui/kit';
import { Page } from '@reunice/modules/shared/data-access';

export const UNIVERSITY_PAGE_HIERARCHY = new InjectionToken<Page>(
  'UNIVERSITY_PAGE_HIERARCHY'
);

@Component({
  selector: 'reunice-university-pages-tree',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    TuiLinkModule,
    TuiTreeModule,
    RouterLink,
  ],
  templateUrl: './university-pages-tree.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityPagesTreeComponent {
  @Input()
  page: Page | null = inject(UNIVERSITY_PAGE_HIERARCHY, { optional: true });

  readonly handler = PAGE_TREE_HANDLER;
}
