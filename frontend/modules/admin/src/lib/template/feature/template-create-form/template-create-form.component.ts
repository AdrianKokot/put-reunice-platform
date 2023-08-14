import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TemplateService } from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { TuiLetModule } from '@taiga-ui/cdk';
import { navigateToResourceDetails } from '../../../shared/util/navigate-to-resource-details';

@Component({
  selector: 'reunice-template-create-form',
  standalone: true,
  imports: [BaseFormImportsModule, TuiEditorModule, TuiLetModule],
  templateUrl: './template-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateCreateFormComponent {
  private readonly _service = inject(TemplateService);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    content: [''],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'TEMPLATE.CREATE.SUCCESS',
    effect: navigateToResourceDetails(),
  });
}
