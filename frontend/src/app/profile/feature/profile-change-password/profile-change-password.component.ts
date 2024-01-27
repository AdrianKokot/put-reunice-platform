import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@eunice/modules/shared/security';
import { FormSubmitWrapper } from '@eunice/modules/shared/util';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputPasswordModule } from '@taiga-ui/kit';

@Component({
  selector: 'eunice-profile-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TuiButtonModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiTextfieldControllerModule,
    TuiLabelModule,
    TuiInputPasswordModule,
  ],
  templateUrl: './profile-change-password.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileChangePasswordComponent {
  private readonly _service = inject(AuthService);

  readonly form = inject(FormBuilder).nonNullable.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.changePassword(value),
    successAlertMessage: 'USER_PASSWORD_CHANGE_SUCCESS',
  });
}
