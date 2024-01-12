import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { catchError, EMPTY, map, startWith, switchMap, throwError } from 'rxjs';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBreadcrumbsModule, TuiLineClampModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintModule, TuiLinkModule } from '@taiga-ui/core';
import { UserControlsResourceDirective } from '@reunice/modules/shared/security';
import { TranslateModule } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { LocalizedPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-page',
  standalone: true,
  imports: [
    CommonModule,
    TuiEditorSocketModule,
    TuiLetModule,
    RouterLinkActive,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiLineClampModule,
    TuiButtonModule,
    RouterLink,
    UserControlsResourceDirective,
    TuiHintModule,
    TranslateModule,
    LocalizedPipeModule,
  ],
  templateUrl: './page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  private readonly _pageService = inject(PageService);
  private readonly _router = inject(Router);

  readonly page$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('id') ?? '1'),
    switchMap((id) =>
      this._pageService.get(id).pipe(
        startWith(null),
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 404) {
            return fromPromise(this._router.navigate(['not-found'])).pipe(
              switchMap(() => EMPTY),
            );
          }

          return throwError(() => err);
        }),
      ),
    ),
  );
}
