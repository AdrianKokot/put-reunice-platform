import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  UniversityService,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { ResourceSearchWrapper } from '../../../shared/util/resource-search-wrapper';

@Component({
  selector: 'reunice-user-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiLetModule,
    TuiDataListWrapperModule,
    TuiMultiSelectModule,
  ],
  templateUrl: './user-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditFormComponent {
  private readonly _service = inject(UserService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    username: ['', [Validators.required, Validators.maxLength(255)]],
    firstName: ['', [Validators.required, Validators.maxLength(255)]],
    lastName: ['', [Validators.required, Validators.maxLength(255)]],
    email: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.email],
    ],
    phoneNumber: ['', [Validators.required, Validators.maxLength(255)]],
    accountType: [AccountTypeEnum.GUEST, [Validators.required]],
    enabled: [true, [Validators.required]],
    enrolledUniversities: [[] as number[]],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'name_ct',
    'name'
  );

  readonly item$ = resourceFromRoute(this._service, (user) => {
    this.form.patchValue({
      ...user,
      enrolledUniversities: user.enrolledUniversities.map((u) => u.id),
    });
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'USER.UPDATE.SUCCESS',
  });

  readonly accountType = AccountTypeEnum;
}
