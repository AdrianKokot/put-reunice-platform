import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  TemplateService,
  UniversityService,
} from '@eunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { FormSubmitWrapper } from '@eunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiMultiSelectModule,
} from '@taiga-ui/kit';
import { AuthService, UserDirective } from '@eunice/modules/shared/security';
import { TuiDropdownModule } from '@taiga-ui/core';

@Component({
  selector: 'eunice-template-create-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiEditorModule,
    TuiDataListWrapperModule,
    TuiCheckboxLabeledModule,
    TuiMultiSelectModule,
    UserDirective,
    TuiDropdownModule,
  ],
  templateUrl: './template-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateCreateFormComponent {
  private readonly _service = inject(TemplateService);
  private readonly _user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    content: [''],
    universities: [this._user?.enrolledUniversities.map((u) => u.id) ?? []],
    availableToAllUniversities: [
      this._user?.accountType === AccountTypeEnum.ADMIN,
    ],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'TEMPLATE_CREATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'name',
  );
}
