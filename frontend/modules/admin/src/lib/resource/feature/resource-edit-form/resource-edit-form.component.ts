import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ResourceService,
  ResourceType,
} from '@reunice/modules/shared/data-access';
import {
  formResourceFromRoute,
  FormSubmitWrapper,
} from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';
import { TuiLetModule } from '@taiga-ui/cdk';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { TuiInputFilesModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-resource-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiLetModule,
    ConfirmDirective,
    TuiInputFilesModule,
  ],
  templateUrl: './resource-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceEditFormComponent {
  private readonly _service = inject(ResourceService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    authorId: [-1, [Validators.required]],
    resourceType: [ResourceType.FILE as ResourceType, [Validators.required]],
    file: [null as File | null, [Validators.maxLength(100)]],
    url: [null as string | null, [Validators.maxLength(255)]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'RESOURCE_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  protected readonly ResourceType = ResourceType;

  readonly item$ = formResourceFromRoute(this._service, this.form);
}
