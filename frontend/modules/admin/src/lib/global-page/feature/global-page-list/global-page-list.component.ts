import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  GlobalPage,
  GlobalPageService,
  Page,
} from '@reunice/modules/shared/data-access';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-global-page-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './global-page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(GlobalPageService)],
})
export class GlobalPageListComponent extends ReuniceAbstractTable<GlobalPage> {
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
