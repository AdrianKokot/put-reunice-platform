import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  Template,
  TemplateService,
} from '@eunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  AbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';
import { AuthService } from '@eunice/modules/shared/security';

@Component({
  selector: 'eunice-template-list',
  templateUrl: './template-list.component.html',
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(TemplateService)],
})
export class TemplateListComponent extends AbstractTable<Template> {
  readonly isUserAdmin =
    inject(AuthService).userSnapshot?.accountType === AccountTypeEnum.ADMIN;
  readonly columns: Array<keyof Template | string> = ['name', 'actions'];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
  });
}
