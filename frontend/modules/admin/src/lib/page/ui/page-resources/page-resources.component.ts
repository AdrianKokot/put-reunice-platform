import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  AbstractTable,
} from '../../../shared';
import { Resource, ResourceService } from '@eunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';

@Component({
  selector: 'eunice-page-resources',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './page-resources.component.html',
  providers: [provideeuniceTable(ResourceService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageResourcesComponent extends AbstractTable<Resource> {
  @Input() set pageId(value: number | null) {
    this.filtersForm.controls.pages_eq.setValue(value);
  }

  readonly columns: Array<keyof Resource | string> = [
    'name',
    'description',
    'author',
    'updatedOn',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    pages_eq: [null as number | null],
  });
}
