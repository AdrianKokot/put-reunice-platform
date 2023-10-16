import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Keyword, KeyWordsService } from '@reunice/modules/shared/data-access';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-keyword-list',
  templateUrl: './keyword-list.component.html',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(KeyWordsService)],
})
export class KeywordListComponent extends ReuniceAbstractTable<Keyword> {
  readonly columns = ['word', 'actions'];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
  });
}
