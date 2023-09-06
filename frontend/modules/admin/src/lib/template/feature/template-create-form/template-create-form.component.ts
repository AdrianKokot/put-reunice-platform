import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  TemplateService,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
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
import { AuthService, UserDirective } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-template-create-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiEditorModule,
    TuiDataListWrapperModule,
    TuiCheckboxLabeledModule,
    TuiMultiSelectModule,
    UserDirective,
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
    allUniversities: [this._user?.accountType === AccountTypeEnum.ADMIN],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) =>
      this._service.create({
        ...value,
        universities: value.allUniversities ? null : value.universities,
      }),
    successAlertMessage: 'TEMPLATE_CREATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'name_ct',
    'name',
  );
}
