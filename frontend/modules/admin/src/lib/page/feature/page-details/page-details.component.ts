import { Page, PageService } from '@eunice/modules/shared/data-access';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  PAGE_TREE_HANDLER,
  resourceIdFromRoute,
} from '@eunice/modules/shared/util';
import { filter, shareReplay, startWith, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '@eunice/modules/shared/security';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';
import {
  TUI_PROMPT,
  TuiIslandModule,
  TuiTabsModule,
  TuiTreeModule,
} from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiDialogService, TuiLinkModule } from '@taiga-ui/core';
import { PageUsersComponent } from '../../ui/page-users/page-users.component';
import { PageResourcesComponent } from '../../ui/page-resources/page-resources.component';
import { TranslateService } from '@ngx-translate/core';
import { TuiDestroyService } from '@taiga-ui/cdk';

@Component({
  selector: 'eunice-page-details',
  standalone: true,
  imports: [
    BaseDetailsImportsModule,
    TuiEditorSocketModule,
    TuiIslandModule,
    TuiTreeModule,
    TuiLinkModule,
    TuiTabsModule,
    PageUsersComponent,
    PageResourcesComponent,
  ],
  templateUrl: './page-details.component.html',
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _translate = inject(TranslateService);
  private readonly _dialog = inject(TuiDialogService);
  private readonly _service = inject(PageService);
  private readonly _destroy$ = inject(TuiDestroyService);

  private readonly _id$ = resourceIdFromRoute();

  readonly item$ = this._id$.pipe(
    switchMap((id) => this._service.get(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly user = inject(AuthService).userSnapshot;

  readonly pagesTree$ = this.item$.pipe(
    filter((page): page is Page => page !== null),
    switchMap((page) =>
      this._service
        .getUniversityHierarchy(page.university.id)
        .pipe(startWith(null)),
    ),
    shareReplay(),
  );

  readonly pagesTreeHandler = PAGE_TREE_HANDLER;

  readonly deleteHandler = new DeleteResourceWrapper<Page, PageService>(
    this._service,
    {
      successAlertMessage: 'PAGE_DELETED_SUCCESS',
      effect: navigateToResourceList(),
    },
  );

  activeTabIndex = 0;

  delete(page: Page) {
    if (!page.hasResources) {
      this.deleteHandler.delete(page.id, 'delete');
      return;
    }

    this._dialog
      .open<boolean>(TUI_PROMPT, {
        label: this._translate.instant(
          'DELETE_PAGE_WITH_RESOURCES_PROMPT_LABEL',
        ),
        size: 's',
        dismissible: false,
        closeable: false,
        data: {
          content: this._translate.instant(
            'DELETE_PAGE_WITH_RESOURCES_PROMPT_DESCRIPTION',
          ),
          yes: this._translate.instant('YES'),
          no: this._translate.instant('NO'),
        },
      })
      .pipe(takeUntil(this._destroy$))
      .subscribe((result) => {
        this.deleteHandler.delete(
          page.id,
          result ? 'deleteWithResources' : 'delete',
        );
      });
  }
}
