import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { TuiButtonModule, TuiHintModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { RouterLink } from '@angular/router';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { UserControlsResourceDirective } from '@reunice/modules/shared/security';
import { navigateToResourceList } from '../../../shared/util/navigate-to-resource-details';

@Component({
  selector: 'reunice-university-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiLetModule,
    TranslateModule,
    TuiEditorSocketModule,
    RouterLink,
    TuiButtonModule,
    ConfirmDirective,
    UserControlsResourceDirective,
    TuiHintModule,
  ],
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
