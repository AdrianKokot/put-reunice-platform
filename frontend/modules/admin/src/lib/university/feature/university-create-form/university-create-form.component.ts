import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';
import { ConfirmDirective } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-university-create-form',
  standalone: true,
  imports: [BaseFormImportsModule, ConfirmDirective],
  templateUrl: './university-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityCreateFormComponent {
  private readonly _service = inject(UniversityService);

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    shortName: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    address: ['', [Validators.maxLength(255)]],
    website: ['', [Validators.maxLength(255)]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'UNIVERSITY_CREATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });
}
