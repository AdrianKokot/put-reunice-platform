import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';

@Component({
  selector: 'reunice-keyword-details',
  standalone: true,
  imports: [BaseDetailsImportsModule],
  templateUrl: './keyword-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordDetailsComponent {
  private readonly _service = inject(KeyWordsService);
  readonly item$ = resourceFromRoute(this._service);

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'KEYWORD_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });
}
