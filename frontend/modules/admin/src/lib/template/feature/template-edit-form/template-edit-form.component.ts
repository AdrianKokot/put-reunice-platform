import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TemplateService } from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import {
  formResourceFromRoute,
  FormSubmitWrapper,
} from '@reunice/modules/shared/util';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-template-edit-form',
  templateUrl: './template-edit-form.component.html',
  standalone: true,
  imports: [BaseFormImportsModule, TuiLetModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditFormComponent {
  private readonly _service = inject(TemplateService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    content: [''],
  });

  readonly item$ = formResourceFromRoute(this._service, this.form);

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'TEMPLATE.UPDATE.SUCCESS',
  });
}
