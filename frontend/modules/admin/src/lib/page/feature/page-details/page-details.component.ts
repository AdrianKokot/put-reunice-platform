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
import { AuthService } from '@reunice/modules/shared/security';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';
import {
  TuiFilesModule,
  TuiIslandModule,
  TuiTagModule,
  TuiTreeModule,
} from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLinkModule } from '@taiga-ui/core';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [
    BaseDetailsImportsModule,
    TuiFilesModule,
    TuiEditorSocketModule,
    TuiIslandModule,
    TuiTreeModule,
    TuiTagModule,
    TuiLinkModule,
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
