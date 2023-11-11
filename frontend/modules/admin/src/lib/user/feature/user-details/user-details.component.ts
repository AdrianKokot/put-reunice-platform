import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  DeleteResourceWrapper,
  resourceFromRoute,
  throwError,
} from '@reunice/modules/shared/util';
import { User, UserService } from '@reunice/modules/shared/data-access';
import { AuthService } from '@reunice/modules/shared/security';
import {
  BaseDetailsImportsModule,
  navigateToResourceList,
} from '../../../shared';
import { TuiTabsModule, TuiTagModule } from '@taiga-ui/kit';
import { UserBasicInformationComponent } from '../../ui/user-basic-information/user-basic-information.component';
import { UserPagesComponent } from '../../ui/user-pages/user-pages.component';
import { UserFilesComponent } from '../../ui/user-files/user-files.component';

@Component({
  selector: 'reunice-user-details',
  standalone: true,
  imports: [
    BaseDetailsImportsModule,
    TuiTagModule,
    TuiTabsModule,
    UserBasicInformationComponent,
    UserPagesComponent,
    UserFilesComponent,
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

  activeTabIndex = 0;
}
