import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  University,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-university-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
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
