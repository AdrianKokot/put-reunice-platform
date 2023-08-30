import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButtonModule, TuiHintModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiHandler, TuiLetModule } from '@taiga-ui/cdk';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
  throwError,
} from '@reunice/modules/shared/util';
import { Page, PageService, User } from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiIslandModule, TuiTreeModule } from '@taiga-ui/kit';
import { filter, shareReplay, startWith, switchMap } from 'rxjs';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { AuthService } from '@reunice/modules/shared/security';
import { navigateToResourceList } from '../../../shared/util/navigate-to-resource-details';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    TuiLetModule,
    TuiButtonModule,
    TuiEditorSocketModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TuiIslandModule,
    TuiTreeModule,
    ConfirmDirective,
    TuiHintModule,
  ],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _service = inject(PageService);
  readonly item$ = resourceFromRoute(this._service);
  readonly user: User =
    inject(AuthService).userSnapshot ?? throwError('User is null');

  readonly pagesTree$ = this.item$.pipe(
    filter((page): page is Page => page !== null),
    switchMap((page) =>
      this._service
        .getUniversityHierarchy(page.university.id)
        .pipe(startWith(null)),
    ),
    shareReplay(),
  );

  readonly pagesTreeHandler: TuiHandler<Page, readonly Page[]> = (item) =>
    item?.children ?? [];

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'PAGE_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });
}
