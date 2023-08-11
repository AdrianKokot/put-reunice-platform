import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountTypeEnum,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-user-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    TuiFieldErrorPipeModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiLabelModule,
    TranslateModule,
    TuiLetModule,
    TuiTextAreaModule,
    RouterLink,
    TuiButtonModule,
    TuiSelectModule,
    TuiDataListModule,
  ],
  templateUrl: './user-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditFormComponent {
  private readonly _service = inject(UserService);
  private readonly _alert = inject(TuiAlertService);

  readonly item$ = resourceFromRoute(this._service, (v) =>
    this.form.patchValue(v)
  );

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
    description: ['', [Validators.required, Validators.maxLength(255)]],
    accountType: [AccountTypeEnum.GUEST, [Validators.required]],
    enabled: [true, [Validators.required]],
  });
  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    effect: () =>
      this._alert.open('User updated successfully', {
        status: TuiNotification.Success,
      }),
  });

  readonly accountType = AccountTypeEnum;
}
