import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { UserDirective } from '@reunice/modules/shared/security';
import { User, UserService } from '@reunice/modules/shared/data-access';

@Component({
  selector: 'reunice-page-users',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    UserDirective,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './page-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(UserService)],
})
export class PageUsersComponent extends ReuniceAbstractTable<User> {
  @Input()
  set handles(value: number | null) {
    this.filtersForm.controls.handlersPages_eq.setValue(value);
  }

  readonly columns: Array<keyof User | string> = [
    'username',
    'firstName',
    'email',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    handlersPages_eq: [null as number | null],
  });
}
