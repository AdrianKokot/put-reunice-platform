import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
import { navigateToResourceDetails } from '../../../shared/util/navigate-to-resource-details';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';

@Component({
  selector: 'reunice-keyword-create-form',
  standalone: true,
  imports: [BaseFormImportsModule],
  templateUrl: './keyword-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordCreateFormComponent {
  private readonly _service = inject(KeyWordsService);

  readonly form = inject(FormBuilder).nonNullable.group({
    word: ['', [Validators.required, Validators.maxLength(255)]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'KEYWORD_CREATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });
}
