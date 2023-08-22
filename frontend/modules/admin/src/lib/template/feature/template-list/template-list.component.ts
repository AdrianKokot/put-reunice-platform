import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Template, TemplateService } from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';

@Component({
  selector: 'reunice-template-list',
  templateUrl: './template-list.component.html',
  imports: [BaseFormImportsModule, BaseTableImportsModule],
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
