import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountType,
  AccountTypeEnum,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    UserDirective,
    FormNotEmptyValuesPipeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(UserService)],
})
export class UserListComponent extends ReuniceAbstractTable<User> {
  private readonly _user = inject(AuthService).userSnapshot;
  readonly columns: Array<keyof User | string> = [
    'username',
    'firstName',
    'email',
    'accountType',
    'enabled',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    search: [''],
    enrolledUniversities_eq: [this._user?.universityId],
    accountType_eq: [null as AccountType | null],
    enabled_eq: [null as boolean | null],
  });

  readonly accountType = AccountTypeEnum;
}
