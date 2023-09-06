import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  UniversityService,
  UserService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiInputPasswordModule,
  TuiMultiSelectModule,
} from '@taiga-ui/kit';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-user-create-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiInputPasswordModule,
    UserDirective,
    TuiComboBoxModule,
  ],
  templateUrl: './user-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateFormComponent {
  private readonly _service = inject(UserService);
  private readonly _user = inject(AuthService).userSnapshot;

  readonly accountType = AccountTypeEnum;

  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(255)]],
    firstName: ['', [Validators.required, Validators.maxLength(255)]],
    lastName: ['', [Validators.required, Validators.maxLength(255)]],
    email: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.email],
    ],
    password: ['', [Validators.required, Validators.maxLength(255)]],
    phoneNumber: ['', [Validators.required, Validators.maxLength(12)]],
    accountType: [this.accountType.USER, [Validators.required]],
    enabled: [true, [Validators.required]],
    enrolledUniversities: [
      (this._user?.enrolledUniversities.map((u) => u.id) ?? []).at(0),
    ],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) =>
      this._service.create({
        ...value,
        enrolledUniversities:
          value.enrolledUniversities !== undefined
            ? [value.enrolledUniversities]
            : [],
      }),
    successAlertMessage: 'USER_CREATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'name_ct',
    'name',
  );
}
