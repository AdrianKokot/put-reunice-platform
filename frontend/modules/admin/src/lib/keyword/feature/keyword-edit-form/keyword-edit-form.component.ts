import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import {
  TuiAlertService,
  TuiButtonModule,
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
import { TuiLetModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-keyword-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiLetModule,
    TuiLabelModule,
    TranslateModule,
    RouterLink,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
  ],
  templateUrl: './keyword-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordEditFormComponent {
  private readonly _service = inject(KeyWordsService);
  private readonly _alert = inject(TuiAlertService);

  readonly item$ = resourceFromRoute(this._service, (v) =>
    this.form.patchValue(v)
  );

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    word: ['', [Validators.required, Validators.maxLength(255)]],
  });
  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    effect: () =>
      this._alert.open('Keyword updated successfully', {
        status: TuiNotification.Success,
      }),
  });
}
