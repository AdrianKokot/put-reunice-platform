import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  AbstractTable,
} from '../../../shared';
import { UserDirective } from '@eunice/modules/shared/security';
import { User, UserService } from '@eunice/modules/shared/data-access';

@Component({
  selector: 'eunice-page-users',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    UserDirective,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './page-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(UserService)],
})
export class PageUsersComponent extends AbstractTable<User> {
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
