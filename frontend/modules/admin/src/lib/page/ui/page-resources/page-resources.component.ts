import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import { Resource, ResourceService } from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-page-resources',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './page-resources.component.html',
  providers: [provideReuniceTable(ResourceService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageResourcesComponent extends ReuniceAbstractTable<Resource> {
  @Input() set pageId(value: number | null) {
    this.filtersForm.controls.pages_eq.setValue(value);
  }

  readonly columns: Array<keyof Resource | string> = [
    'name',
    'updatedOn',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    pages_eq: [null as number | null],
  });
}
