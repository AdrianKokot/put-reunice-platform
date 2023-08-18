import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Page, PageService } from '@reunice/modules/shared/data-access';
import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { FormBuilder } from '@angular/forms';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';

@Component({
  selector: 'reunice-page-list',
  standalone: true,
  imports: [BaseFormImportsModule, BaseTableImportsModule],
  templateUrl: './page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(PageService)],
})
export class PageListComponent extends ReuniceAbstractTable<Page> {
  readonly columns: Array<keyof Page | string> = [
    'title',
    'createdOn',
    'university',
    'creator',
    'hidden',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
  });
}
