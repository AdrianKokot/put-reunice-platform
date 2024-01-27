import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { resourceIdFromRoute } from '@eunice/modules/shared/util';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import {
  ApiPaginatedResponse,
  Page,
  PageService,
} from '@eunice/modules/shared/data-access';
import { TranslateModule } from '@ngx-translate/core';
import { TuiForModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiIslandModule,
  TuiLineClampModule,
  TuiPaginationModule,
} from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { LocalizedPipeModule } from '@eunice/modules/shared/ui';

@Component({
  selector: 'eunice-author-shell',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLetModule,
    NgOptimizedImage,
    TuiForModule,
    TuiIslandModule,
    TuiLineClampModule,
    RouterLink,
    LocalizedPipeModule,
    TuiPaginationModule,
  ],
  templateUrl: './author-shell.component.html',
  styleUrls: ['./author-shell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorShellComponent {
  readonly PAGE_SIZE = 10;
  readonly placeholderArray = new Array(this.PAGE_SIZE);

  private readonly pageService = inject(PageService);

  readonly pageIndex$ = new BehaviorSubject<number>(0);
  private readonly result$ = combineLatest([
    this.pageIndex$,
    resourceIdFromRoute(),
  ]).pipe(
    switchMap(([page, creator_eq]) =>
      this.pageService
        .getAll({
          creator_eq,
          page,
          size: this.PAGE_SIZE,
        })
        .pipe(startWith(null)),
    ),
    shareReplay(1),
  );

  readonly pages$ = this.result$.pipe(
    map((result) => (result ? result.items : null)),
  );

  readonly author$ = this.result$.pipe(
    filter((result): result is ApiPaginatedResponse<Page> => result !== null),
    map((result) => result.items[0]?.creator),
    map((author) => `${author.firstName} ${author.lastName}`),
    take(1),
    shareReplay(1),
  );

  readonly totalPages$ = this.result$.pipe(
    map((result) => Math.ceil((result?.totalItems ?? 0) / this.PAGE_SIZE)),
  );
}
