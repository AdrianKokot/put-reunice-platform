import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { navigateToResourceList } from '../../../shared/util/navigate-to-resource-details';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { UserControlsResourceDirective } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-keyword-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    TuiLetModule,
    TuiButtonModule,
    RouterLink,
    ConfirmDirective,
    UserControlsResourceDirective,
  ],
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
