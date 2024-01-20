import {
  Page,
  PageService,
  ResourceService,
} from '@reunice/modules/shared/data-access';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  PAGE_TREE_HANDLER,
  resourceIdFromRoute,
} from '@reunice/modules/shared/util';
import { filter, shareReplay, startWith, switchMap } from 'rxjs';
import { AuthService } from '@reunice/modules/shared/security';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';
import { TuiIslandModule, TuiTabsModule, TuiTreeModule } from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLinkModule } from '@taiga-ui/core';
import { PageUsersComponent } from '../../ui/page-users/page-users.component';
import { PageResourcesComponent } from '../../ui/page-resources/page-resources.component';

@Component({
  selector: 'reunice-page-details',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _service = inject(PageService);
  private readonly _fileService = inject(ResourceService);

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

  readonly resources$ = this._id$.pipe(
    switchMap((id) => this._fileService.getByPage(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly pagesTreeHandler = PAGE_TREE_HANDLER;

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'PAGE_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });

  activeTabIndex = 0;
}
