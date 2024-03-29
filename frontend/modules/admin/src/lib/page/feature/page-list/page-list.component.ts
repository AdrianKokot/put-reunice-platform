import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Page,
  PageService,
  UniversityService,
  UserService,
} from '@eunice/modules/shared/data-access';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  ResourceSearchWrapper,
  AbstractTable,
} from '../../../shared';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';

@Component({
  selector: 'eunice-page-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(PageService)],
})
export class PageListComponent extends AbstractTable<Page> {
  readonly columns: Array<keyof Page | string> = [
    'title',
    'createdOn',
    'university',
    'creator',
    'hidden',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    search: [''],
    hidden_eq: [null as boolean | null],
    creator_eq: [null as number | null],
    university_eq: [null as number | null],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'shortName',
  );

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    ['firstName', 'lastName'],
  );
}
