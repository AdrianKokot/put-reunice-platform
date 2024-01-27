import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormSubmitWrapper } from '@eunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';
import { GlobalPageService } from '@eunice/modules/shared/data-access';

@Component({
  selector: 'eunice-global-page-create-form',
  standalone: true,
  imports: [BaseFormImportsModule],
  templateUrl: './global-page-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalPageCreateFormComponent {
  private readonly _service = inject(GlobalPageService);

  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'PAGE_CREATE_SUCCESS',
    effect: navigateToResourceDetails(['edit']),
  });
}
