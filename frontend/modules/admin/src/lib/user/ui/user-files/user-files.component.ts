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
import { FileResource, FileService } from '@reunice/modules/shared/data-access';
import { FormBuilder } from '@angular/forms';
import { FormNotEmptyValuesPipeModule } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-user-files',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
  ],
  templateUrl: './user-files.component.html',
  providers: [provideReuniceTable(FileService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFilesComponent extends ReuniceAbstractTable<FileResource> {
  @Input() set userId(value: number | null) {
    this.filtersForm.controls.uploadedById_eq.setValue(value);
  }

  readonly columns: Array<keyof FileResource | string> = [
    'name',
    'pageTitle',
    'lastModified',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).group({
    uploadedById_eq: [null as number | null],
  });
}
