import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TemplateService } from '@reunice/modules/shared/data-access';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { CommonModule } from '@angular/common';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';

@Component({
  selector: 'reunice-template-edit-form',
  templateUrl: './template-edit-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiEditorModule,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditFormComponent {
  private readonly _service = inject(TemplateService);
  private readonly _alert = inject(TuiAlertService);
  private readonly _translate = inject(TranslateService);

  item$ = resourceFromRoute(this._service, (v) => this.form.patchValue(v));

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    content: [''],
  });
  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    effect: (result) => {
      this.form.patchValue(result);

      return this._alert.open(this._translate.instant('TEMPLATE.UPDATE.SUCCESS'), {
        status: TuiNotification.Success,
      });
    },
  });
}
