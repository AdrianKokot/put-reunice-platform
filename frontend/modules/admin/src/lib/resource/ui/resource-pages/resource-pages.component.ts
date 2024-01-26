import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  ResourceSearchWrapper,
  AbstractTable,
} from '../../../shared';
import {
  Page,
  PageService,
  Resource,
  UniversityService,
} from '@eunice/modules/shared/data-access';

@Component({
  selector: 'eunice-resource-pages',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './resource-pages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(PageService)],
})
export class ResourcePagesComponent extends AbstractTable<Page> {
  @Input() set resourceId(value: Resource['id'] | null) {
    this.filtersForm.controls.resources_eq.setValue(value);
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
    resources_eq: [null as number | null],
    university_eq: [null as number | null],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'shortName',
  );
}
