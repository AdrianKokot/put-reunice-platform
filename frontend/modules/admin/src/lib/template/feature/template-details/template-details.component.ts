import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DeleteResourceWrapper,
  NgForTrackByIdDirective,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { TemplateService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { RouterLink } from '@angular/router';
import {
  UserControlsResourceDirective,
  UserDirective,
} from '@reunice/modules/shared/security';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { navigateToResourceList } from '../../../shared/util/navigate-to-resource-details';

@Component({
  selector: 'reunice-template-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiLabelModule,
    TranslateModule,
    TuiTagModule,
    TuiEditorSocketModule,
    RouterLink,
    TuiButtonModule,
    UserDirective,
    NgForTrackByIdDirective,
    ConfirmDirective,
    UserControlsResourceDirective,
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
