import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Keyword, KeyWordsService } from '@reunice/modules/shared/data-access';
import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { FormBuilder } from '@angular/forms';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';

@Component({
  selector: 'reunice-keyword-list',
  templateUrl: './keyword-list.component.html',
  standalone: true,
  imports: [BaseFormImportsModule, BaseTableImportsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(KeyWordsService)],
})
export class KeywordListComponent extends ReuniceAbstractTable<Keyword> {
  readonly columns = ['word', 'actions'];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
  });
}
