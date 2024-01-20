import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { ResourceService } from '@reunice/modules/shared/data-access';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';

@Component({
  selector: 'reunice-resource-details',
  standalone: true,
  imports: [BaseDetailsImportsModule],
  templateUrl: './resource-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailsComponent {
  private readonly _service = inject(ResourceService);

  readonly item$ = resourceFromRoute(this._service);

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'RESOURCE_DELETE_SUCCESS',
    effect: navigateToResourceList(),
  });
}
