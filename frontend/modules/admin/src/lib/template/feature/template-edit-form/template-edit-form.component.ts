import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  TemplateService,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { ResourceSearchWrapper } from '../../../shared/util/resource-search-wrapper';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiMultiSelectModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'reunice-template-edit-form',
  templateUrl: './template-edit-form.component.html',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiLetModule,
    TuiEditorModule,
    TuiCheckboxLabeledModule,
    TuiDataListWrapperModule,
    TuiMultiSelectModule,
    UserDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditFormComponent {
  private readonly _service = inject(TemplateService);
  private readonly _user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    content: [''],
    universities: [this._user?.enrolledUniversities.map((u) => u.id) ?? []],
    allUniversities: [this._user?.accountType === AccountTypeEnum.ADMIN],
  });

  readonly item$ = resourceFromRoute(this._service, (v) =>
    this.form.patchValue({
      ...v,
      universities: v.universities?.map((u) => u.id) ?? [],
      allUniversities: v.universities === null,
    }),
  );

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'TEMPLATE_UPDATE_SUCCESS',
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'name_ct',
    'name',
  );
}
