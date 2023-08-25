import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Page,
  PageService,
  UniversityService,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared/table/reunice-abstract-table.directive';
import { FormBuilder } from '@angular/forms';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { BaseTableImportsModule } from '../../../shared/base-table-imports.module';
import { ResourceSearchWrapper } from '../../../shared/util/resource-search-wrapper';

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

  readonly filtersForm = inject(FormBuilder).group({
    search: [''],
    hidden_eq: [null as boolean | null],
    creator_eq: [null as number | null],
    university_eq: [null as number | null],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'name_ct',
    'shortName'
  );

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'email_ct',
    'firstName'
  );
}
