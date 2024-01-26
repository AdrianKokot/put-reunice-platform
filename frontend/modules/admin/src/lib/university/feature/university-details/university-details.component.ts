import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
} from '@eunice/modules/shared/util';
import { UniversityService } from '@eunice/modules/shared/data-access';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';

@Component({
  selector: 'eunice-university-details',
  standalone: true,
  imports: [BaseDetailsImportsModule, TuiEditorSocketModule],
  templateUrl: './university-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityDetailsComponent {
  private readonly _service = inject(UniversityService);

  readonly item$ = resourceFromRoute(this._service);

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'UNIVERSITY_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });
}
