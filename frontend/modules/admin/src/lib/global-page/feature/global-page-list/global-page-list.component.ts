import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  GlobalPage,
  GlobalPageService,
  Page,
} from '@eunice/modules/shared/data-access';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  AbstractTable,
} from '../../../shared';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';

@Component({
  selector: 'eunice-global-page-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './global-page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(GlobalPageService)],
})
export class GlobalPageListComponent extends AbstractTable<GlobalPage> {
  readonly columns: Array<keyof Page | string> = [
    'title',
    'createdOn',
    'hidden',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    search: [''],
    hidden_eq: [null as boolean | null],
  });
}
