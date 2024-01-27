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
  selector: 'eunice-user-resources',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './user-resources.component.html',
  providers: [provideeuniceTable(ResourceService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserResourcesComponent extends AbstractTable<Resource> {
  @Input() set userId(value: number | null) {
    this.filtersForm.controls.author_eq.setValue(value);
  }

  readonly columns: Array<keyof Resource | string> = [
    'name',
    'updatedOn',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    author_eq: [null as number | null],
  });
}
