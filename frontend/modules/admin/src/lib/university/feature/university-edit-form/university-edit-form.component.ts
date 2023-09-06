import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UniversityService } from '@reunice/modules/shared/data-access';
import {
  formResourceFromRoute,
  FormSubmitWrapper,
} from '@reunice/modules/shared/util';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiLetModule } from '@taiga-ui/cdk';
import { navigateToResourceDetails } from '../../../shared/util/navigate-to-resource-details';

@Component({
  selector: 'reunice-university-edit-form',
  standalone: true,
  imports: [BaseFormImportsModule, TuiLetModule],
  templateUrl: './university-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityEditFormComponent {
  private readonly _service = inject(UniversityService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    shortName: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
  });

  readonly item$ = formResourceFromRoute(this._service, this.form);

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'UNIVERSITY_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });
}
