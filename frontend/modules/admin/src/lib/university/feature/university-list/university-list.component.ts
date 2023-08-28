import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  University,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';

@Component({
  selector: 'reunice-university-list',
  standalone: true,
  imports: [BaseFormImportsModule, BaseTableImportsModule],
  templateUrl: './university-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(UniversityService)],
})
export class UniversityListComponent extends ReuniceAbstractTable<University> {
  readonly columns: Array<keyof University | string> = [
    'name',
    'shortName',
    'hidden',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    search: [''],
    hidden_eq: [null as boolean | null],
  });
}
