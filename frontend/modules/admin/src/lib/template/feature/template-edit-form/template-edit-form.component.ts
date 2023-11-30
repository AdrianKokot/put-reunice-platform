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
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { TuiEditorModule } from '@tinkoff/tui-editor';
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
    availableToAllUniversities: [
      this._user?.accountType === AccountTypeEnum.ADMIN,
    ],
  });

  readonly item$ = resourceFromRoute(this._service, (v) =>
    this.form.patchValue({
      ...v,
      universities: v.universities?.map((u) => u.id) ?? [],
    }),
  );

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'TEMPLATE_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'name',
  );
}
