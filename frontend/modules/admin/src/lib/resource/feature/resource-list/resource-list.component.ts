import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Resource,
  ResourceService,
  UserService,
} from '@eunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  ResourceSearchWrapper,
  AbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@eunice/modules/shared/ui';
import { AuthService } from '@eunice/modules/shared/security';

@Component({
  selector: 'eunice-resource-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './resource-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideeuniceTable(ResourceService)],
})
export class ResourceListComponent extends AbstractTable<Resource> {
  private readonly _user = inject(AuthService).userSnapshot;
  readonly columns: Array<keyof Resource | string> = [
    'name',
    'description',
    'author',
    'updatedOn',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    search: [''],
    author_eq: [null as boolean | null],
  });

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    ['firstName', 'lastName'],
    { enrolledUniversities_eq: this._user.universityId },
    [this._user],
  );
}
