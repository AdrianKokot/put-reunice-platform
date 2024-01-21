import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Resource,
  ResourceService,
  UserService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ResourceSearchWrapper,
  ReuniceAbstractTable,
} from '../../../shared';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';
import { AuthService } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-resource-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './resource-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideReuniceTable(ResourceService)],
})
export class ResourceListComponent extends ReuniceAbstractTable<Resource> {
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
