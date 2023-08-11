import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';
import { UniversityService } from '@reunice/modules/shared/data-access';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';

@Component({
  selector: 'reunice-university-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TuiLabelModule,
    TranslateModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiTextAreaModule,
    TuiLetModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiButtonModule,
  ],
  templateUrl: './university-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityEditFormComponent {
  private readonly _service = inject(UniversityService);
  private readonly _alert = inject(TuiAlertService);

  readonly university$ = resourceFromRoute(this._service, (v) =>
    this.form.patchValue(v)
  );

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    shortName: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
  });
  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    effect: (result) => {
      this.form.patchValue(result);

      return this._alert.open('University updated successfully', {
        status: TuiNotification.Success,
      });
    },
  });
}
