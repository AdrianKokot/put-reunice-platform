import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ResourceSearchWrapper,
  ReuniceAbstractTable,
} from '../../../shared';
import {
  Page,
  PageService,
  UniversityService,
} from '@reunice/modules/shared/data-access';

@Component({
  selector: 'reunice-user-pages',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './user-pages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(PageService)],
})
export class UserPagesComponent extends ReuniceAbstractTable<Page> {
  @Input() set userId(value: number | null) {
    this.filtersForm.controls.creator_eq.setValue(value);
  }

  @Input() set handlerId(value: number | null) {
    this.filtersForm.controls.handlers_eq.setValue(value);
  }

  readonly columns: Array<keyof Page | string> = [
    'title',
    'createdOn',
    'university',
    'hidden',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    hidden_eq: [null as boolean | null],
    creator_eq: [null as number | null],
    handlers_eq: [null as number | null],
    university_eq: [null as number | null],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'shortName',
  );
}
