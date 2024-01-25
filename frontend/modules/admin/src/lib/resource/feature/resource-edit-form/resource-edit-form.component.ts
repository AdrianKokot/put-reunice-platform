import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAX_FILE_SIZE,
  ResourceService,
  ResourceType,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  CustomValidators,
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { TuiLetModule } from '@taiga-ui/cdk';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFileLike,
  TuiInputFilesModule,
} from '@taiga-ui/kit';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'reunice-resource-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiLetModule,
    ConfirmDirective,
    TuiInputFilesModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    UserDirective,
  ],
  templateUrl: './resource-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceEditFormComponent {
  protected readonly MAX_FILE_SIZE = MAX_FILE_SIZE;
  private readonly _service = inject(ResourceService);
  protected readonly user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group(
    {
      id: [-1, [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      authorId: [-1, [Validators.required]],
      resourceType: [ResourceType.FILE as ResourceType, [Validators.required]],
      file: [null as TuiFileLike | null],
      url: [null as string | null, [Validators.maxLength(255)]],
    },
    {
      validators: [
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
    submit: (value) => this._service.update(value),
    successAlertMessage: 'RESOURCE_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  protected readonly ResourceType = ResourceType;

  readonly item$ = resourceFromRoute(this._service, (item) => {
    this.form.patchValue({
      ...item,
      authorId: item.author.id,
      url: item.resourceType === ResourceType.LINK ? item.path : null,
    });

    if (item.resourceType === ResourceType.LINK) {
      this.form.addValidators([
        CustomValidators.crossFieldValidation(
          'resourceType',
          ResourceType.FILE,
          ['file'],
          Validators.required,
        ),
      ]);
    }

    this.userSearch.addItem(item.author);
  });

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
