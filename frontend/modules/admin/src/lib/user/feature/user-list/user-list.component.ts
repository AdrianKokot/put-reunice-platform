import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { User, UserService } from '@reunice/modules/shared/data-access';
import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { FormBuilder } from '@angular/forms';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';

@Component({
  selector: 'reunice-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [BaseFormImportsModule, BaseTableImportsModule],
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

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
  });
}
