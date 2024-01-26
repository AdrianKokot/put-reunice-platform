import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountType,
  AccountTypeEnum,
  UniversityService,
  User,
  UserService,
} from '@eunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import { AuthService, UserDirective } from '@eunice/modules/shared/security';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  ResourceSearchWrapper,
  AbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';
import { TuiComboBoxModule, TuiDataListWrapperModule } from '@taiga-ui/kit';

@Component({
  selector: 'eunice-user-list',
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
  providers: [provideeuniceTable(UserService)],
})
export class UserListComponent extends AbstractTable<User> {
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
