import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  DeleteResourceWrapper,
  NgForTrackByIdDirective,
  resourceFromRoute,
  throwError,
} from '@reunice/modules/shared/util';
import { User, UserService } from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { TuiTagModule } from '@taiga-ui/kit';
import {
  AuthService,
  UserControlsResourceDirective,
  UserDirective,
} from '@reunice/modules/shared/security';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { navigateToResourceList } from '../../../shared/util/navigate-to-resource-details';

@Component({
  selector: 'reunice-user-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    TuiLetModule,
    TuiButtonModule,
    RouterLink,
    NgForTrackByIdDirective,
    TuiTagModule,
    UserDirective,
    ConfirmDirective,
    UserControlsResourceDirective,
  ],
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent {
  private readonly _service = inject(UserService);
  readonly user: User =
    inject(AuthService).userSnapshot ?? throwError('User is null');
  readonly item$ = resourceFromRoute(this._service);

  readonly deleteHandler = new DeleteResourceWrapper(this._service, {
    successAlertMessage: 'USER_DELETED_SUCCESS',
    effect: navigateToResourceList(),
  });
}
