import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FileResource,
  FileService,
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
import { throwError } from '@reunice/modules/shared/util';

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
  providers: [provideReuniceTable(FileService)],
})
export class ResourceListComponent extends ReuniceAbstractTable<FileResource> {
  private readonly _user =
    inject(AuthService).userSnapshot ?? throwError('User is null');
  readonly columns: Array<keyof FileResource | string> = [
    'name',
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
