import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Keyword, KeyWordsService } from '@reunice/modules/shared/data-access';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormBuilder } from '@angular/forms';

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
