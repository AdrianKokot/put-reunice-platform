import {
  FileService,
  Page,
  PageService,
  User,
} from '@reunice/modules/shared/data-access';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  PAGE_TREE_HANDLER,
  resourceIdFromRoute,
  throwError,
} from '@reunice/modules/shared/util';
import { filter, shareReplay, startWith, switchMap } from 'rxjs';
import {
  AuthService,
  UserControlsResourceDirective,
} from '@reunice/modules/shared/security';
import { BaseFormImportsModule, navigateToResourceList } from '../../../shared';
import { TuiFilesModule, TuiIslandModule, TuiTreeModule } from '@taiga-ui/kit';
import {
  ConfirmDirective,
  LocalizedPipeModule,
} from '@reunice/modules/shared/ui';
import { TuiHintModule } from '@taiga-ui/core';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiFilesModule,
    ConfirmDirective,
    TuiHintModule,
    UserControlsResourceDirective,
    TuiEditorSocketModule,
    TuiIslandModule,
    TuiTreeModule,
    LocalizedPipeModule,
    TuiLetModule,
  ],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _service = inject(PageService);
  private readonly _fileService = inject(FileService);

  private readonly _id$ = resourceIdFromRoute();

  readonly item$ = this._id$.pipe(
    switchMap((id) => this._service.get(id).pipe(startWith(null))),
    shareReplay(),
  );
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

  readonly files$ = this._id$.pipe(
    switchMap((id) => this._fileService.getAll(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly pagesTreeHandler = PAGE_TREE_HANDLER;

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'PAGE_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });
}
