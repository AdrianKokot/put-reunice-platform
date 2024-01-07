import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountType,
  AccountTypeEnum,
  UniversityService,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ResourceSearchWrapper,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';
import { TuiComboBoxModule, TuiDataListWrapperModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    UserDirective,
    FormNotEmptyValuesPipeModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(UserService)],
})
export class UserListComponent extends ReuniceAbstractTable<User> {
  readonly user = inject(AuthService).userSnapshot;
  readonly columns: Array<keyof User | string> = [
    'username',
    'firstName',
    'email',
    'accountType',
    'enabled',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
    enrolledUniversities_eq: [this.user?.universityId],
    accountType_eq: [null as AccountType | null],
    enabled_eq: [null as boolean | null],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'shortName',
  );

  readonly accountType = AccountTypeEnum;
}
