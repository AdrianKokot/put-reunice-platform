import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Template, TemplateService } from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-template-list',
  templateUrl: './template-list.component.html',
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(TemplateService)],
})
export class TemplateListComponent extends ReuniceAbstractTable<Template> {
  readonly columns: Array<keyof Template | string> = ['name', 'actions'];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
  });
}
