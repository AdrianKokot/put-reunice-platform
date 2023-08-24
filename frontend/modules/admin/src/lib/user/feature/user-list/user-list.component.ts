import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountType,
  AccountTypeEnum,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  provideReuniceTable,
  ResourceFilterForm,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { FormBuilder } from '@angular/forms';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';
import { UserDirective } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [BaseFormImportsModule, BaseTableImportsModule, UserDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(UserService)],
})
export class UserListComponent extends ReuniceAbstractTable<User> {
  readonly columns: Array<keyof User | string> = [
    'username',
    'firstName',
    'lastName',
    'accountType',
    'enabled',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group<ResourceFilterForm<User>>({
    search: [''],
    accountType_eq: [null as AccountType | null],
    enabled_eq: [null as boolean | null],
  });

  readonly accountType = AccountTypeEnum;
}
