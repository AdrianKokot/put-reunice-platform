import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  PageService,
  UniversityService,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  FormSubmitWrapper,
  PAGE_TREE_HANDLER,
} from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import {
  distinctUntilChanged,
  filter,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiIslandModule,
  TuiRadioLabeledModule,
  TuiTreeModule,
} from '@taiga-ui/kit';
import { TuiCheckedModule, TuiValueChangesModule } from '@taiga-ui/cdk';
import { TuiLinkModule } from '@taiga-ui/core';
import { ConfirmDirective } from '@reunice/modules/shared/ui';

@Component({
  selector: 'reunice-page-create-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiEditorModule,
    TuiDataListWrapperModule,
    TuiComboBoxModule,
    TuiValueChangesModule,
    TuiTreeModule,
    TuiLinkModule,
    TuiRadioLabeledModule,
    TuiIslandModule,
    UserDirective,
    ConfirmDirective,
    TuiCheckedModule,
  ],
  templateUrl: './page-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCreateFormComponent {
  private readonly _service = inject(PageService);
  private readonly _user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
    creatorId: [this._user?.id ?? -1, [Validators.required]],
    parentId: [-1, [Validators.required]],
    parentName: ['test'],
    universityId: [
      this._user?.enrolledUniversities?.at(0)?.id ?? null,
      [Validators.required],
    ],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'PAGE_CREATE_SUCCESS',
    effect: navigateToResourceDetails(['edit']),
  });

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    (item) => `${item.firstName} ${item.lastName} (${item.email})`,
  );

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'name',
  );

  readonly pagesTree$ = this.form.controls.universityId.valueChanges.pipe(
    startWith(this.form.controls.universityId.value),
    distinctUntilChanged(),
    filter((id): id is number => id !== null),
    tap(() => this.form.controls.parentId.reset()),
    switchMap((id) =>
      this._service.getUniversityHierarchy(id).pipe(
        tap((page) => this.form.controls.parentId.setValue(page.id)),
        startWith(null),
      ),
    ),
    shareReplay(),
  );

  readonly pagesTreeHandler = PAGE_TREE_HANDLER;
}
