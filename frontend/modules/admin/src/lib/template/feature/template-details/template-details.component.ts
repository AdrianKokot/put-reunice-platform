import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  NgForTrackByIdDirective,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { TemplateService } from '@reunice/modules/shared/data-access';
import { TuiTagModule } from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';

@Component({
  selector: 'reunice-template-details',
  standalone: true,
  imports: [
    BaseDetailsImportsModule,
    TuiTagModule,
    TuiEditorSocketModule,
    NgForTrackByIdDirective,
  ],
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsComponent {
  private readonly _service = inject(TemplateService);
  readonly item$ = resourceFromRoute(this._service);

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'TEMPLATE_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });
}
