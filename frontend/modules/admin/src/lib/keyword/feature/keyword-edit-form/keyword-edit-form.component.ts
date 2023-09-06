import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import {
  formResourceFromRoute,
  FormSubmitWrapper,
} from '@reunice/modules/shared/util';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';

@Component({
  selector: 'reunice-keyword-edit-form',
  standalone: true,
  imports: [BaseFormImportsModule],
  templateUrl: './keyword-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordEditFormComponent {
  private readonly _service = inject(KeyWordsService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    word: ['', [Validators.required, Validators.maxLength(255)]],
  });

  readonly item$ = formResourceFromRoute(this._service, this.form);

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'KEYWORD_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });
}
