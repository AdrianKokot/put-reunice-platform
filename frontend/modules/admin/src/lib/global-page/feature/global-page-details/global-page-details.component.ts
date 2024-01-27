import { GlobalPageService } from '@eunice/modules/shared/data-access';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  resourceIdFromRoute,
} from '@eunice/modules/shared/util';
import { shareReplay, startWith, switchMap } from 'rxjs';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';
import { TuiTabsModule } from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLinkModule } from '@taiga-ui/core';

@Component({
  selector: 'eunice-global-page-details',
  standalone: true,
  imports: [
    BaseDetailsImportsModule,
    TuiEditorSocketModule,
    TuiLinkModule,
    TuiTabsModule,
  ],
  templateUrl: './global-page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalPageDetailsComponent {
  private readonly _service = inject(GlobalPageService);

  readonly item$ = resourceIdFromRoute().pipe(
    switchMap((id) => this._service.get(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'PAGE_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });

  activeTabIndex = 0;
}
