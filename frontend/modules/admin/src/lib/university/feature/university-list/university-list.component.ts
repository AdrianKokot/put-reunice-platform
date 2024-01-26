import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  University,
  UniversityService,
} from '@eunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  AbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';

@Component({
  selector: 'eunice-university-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './university-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(UniversityService)],
})
export class UniversityListComponent extends AbstractTable<University> {
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
