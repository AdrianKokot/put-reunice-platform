import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAX_FILE_SIZE,
  ResourceService,
  ResourceType,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  CustomValidators,
  FormSubmitWrapper,
} from '@reunice/modules/shared/util';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFileLike,
  TuiInputFilesModule,
} from '@taiga-ui/kit';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'reunice-resource-create-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    ConfirmDirective,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    UserDirective,
    TuiInputFilesModule,
  ],
  templateUrl: './resource-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCreateFormComponent {
  protected readonly MAX_FILE_SIZE = MAX_FILE_SIZE;
  private readonly _service = inject(ResourceService);
  protected readonly user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group(
    {
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      authorId: [this.user.id, [Validators.required]],
      resourceType: [ResourceType.FILE as ResourceType, [Validators.required]],
      file: [null as TuiFileLike | null],
      url: [null as string | null, [Validators.maxLength(255)]],
    },
    {
      validators: [
        CustomValidators.crossFieldValidation(
          'resourceType',
          ResourceType.FILE,
          ['file'],
          Validators.required,
        ),
        CustomValidators.crossFieldValidation(
          'resourceType',
          ResourceType.LINK,
          ['url'],
          Validators.required,
        ),
      ],
    },
  );

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'RESOURCE_CREATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });
  protected readonly ResourceType = ResourceType;

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    ['firstName', 'lastName'],
    { enrolledUniversities_eq: this.user.universityId },
    [this.user],
  );

  readonly rejectedFiles$ = new BehaviorSubject<TuiFileLike[]>([]);

  onReject(files: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next([
      ...this.rejectedFiles$.value,
      ...(Array.isArray(files) ? files : [files]),
    ]);
  }

  removeFile(): void {
    this.handler.form.controls.file.setValue(null);
  }

  clearRejected({ name }: TuiFileLike): void {
    this.rejectedFiles$.next(
      this.rejectedFiles$.value.filter((rejected) => rejected.name !== name),
    );
  }
}
