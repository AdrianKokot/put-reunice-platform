import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@reunice/modules/shared/security';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TuiButtonModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiLabelModule,
  ],
  templateUrl: './profile-form.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  private readonly _service = inject(AuthService);
  private readonly _user = this._service.userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    firstName: [
      this._user.firstName,
      [Validators.required, Validators.maxLength(255)],
    ],
    lastName: [
      this._user.lastName,
      [Validators.required, Validators.maxLength(255)],
    ],
    email: [
      this._user.email,
      [Validators.required, Validators.maxLength(255), Validators.email],
    ],
    phoneNumber: [
      this._user.phoneNumber,
      [Validators.required, Validators.maxLength(255)],
    ],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'CHANGES_SAVED_SUCCESS',
  });
}
