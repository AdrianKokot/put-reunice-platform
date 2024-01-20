import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, EMPTY, startWith, switchMap, throwError } from 'rxjs';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBreadcrumbsModule, TuiLineClampModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintModule, TuiLinkModule } from '@taiga-ui/core';
import { resourceIdFromRoute } from '@reunice/modules/shared/util';
import { PageResourcesListComponent } from '../page-resources-list/page-resources-list.component';
import { UserControlsResourceDirective } from '@reunice/modules/shared/security';
import { TranslateModule } from '@ngx-translate/core';
import { PageContactFormComponent } from '../page-contact-form/page-contact-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { LocalizedPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiEditorSocketModule,
    TuiLetModule,
    RouterLinkActive,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiLineClampModule,
    PageResourcesListComponent,
    TuiButtonModule,
    RouterLink,
    UserControlsResourceDirective,
    TuiHintModule,
    TranslateModule,
    PageContactFormComponent,
    LocalizedPipeModule,
  ],
  styleUrls: ['./page-details.component.less'],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _pageService = inject(PageService);
  private readonly _router = inject(Router);

  private readonly _pageId$ = resourceIdFromRoute('pageId');

  readonly page$ = this._pageId$.pipe(
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
