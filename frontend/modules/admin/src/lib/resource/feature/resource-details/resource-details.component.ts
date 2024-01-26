import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
} from '@eunice/modules/shared/util';
import {
  ResourceService,
  ResourceType,
} from '@eunice/modules/shared/data-access';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';
import { TuiTabsModule } from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { ResourcePagesComponent } from '../../ui/resource-pages/resource-pages.component';

@Component({
  selector: 'eunice-resource-details',
  standalone: true,
  imports: [
    BaseDetailsImportsModule,
    TuiTabsModule,
    TuiEditorSocketModule,
    ResourcePagesComponent,
  ],
  templateUrl: './resource-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDetailsComponent {
  private readonly _service = inject(ResourceService);
  protected readonly ResourceType = ResourceType;

  readonly item$ = resourceFromRoute(this._service);

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'RESOURCE_DELETE_SUCCESS',
    effect: navigateToResourceList(),
  });

  activeTabIndex = 0;
}
