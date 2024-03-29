import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Page,
  PageService,
  UniversityService,
  UserService,
} from '@eunice/modules/shared/data-access';
import {
  FormSubmitWrapper,
  PAGE_TREE_HANDLER,
  parseNullableInt,
} from '@eunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { AuthService, UserDirective } from '@eunice/modules/shared/security';
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
import { TuiDropdownModule, TuiLinkModule } from '@taiga-ui/core';
import { ConfirmDirective } from '@eunice/modules/shared/ui';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eunice-page-create-form',
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
    TuiDropdownModule,
  ],
  templateUrl: './page-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCreateFormComponent {
  private readonly _service = inject(PageService);
  private readonly _user = inject(AuthService).userSnapshot;
  private readonly _route = inject(ActivatedRoute).snapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
    creatorId: [this._user.id, [Validators.required]],
    parentId: [
      parseNullableInt(this._route.queryParams['parentId']),
      [Validators.required],
    ],
    universityId: [
      parseNullableInt(this._route.queryParams['universityId']) ??
        this._user.universityId,
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
    { enrolledUniversities_eq: this._user.universityId },
    [this._user],
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
    switchMap((id) =>
      this._service.getUniversityHierarchy(id).pipe(startWith(null)),
    ),
    tap((page) => {
      if (
        page !== null &&
        parseNullableInt(this._route.queryParams['universityId']) !==
          this.form.controls.universityId.value
      ) {
        this.form.patchValue({ parentId: page?.id });
      }
    }),
    shareReplay(1),
  );

  readonly pagesTreeHandler = PAGE_TREE_HANDLER;

  selectedPageName = '';

  onParentIdChange(checked: boolean, page: Page) {
    if (checked) {
      this.selectedPageName = page.title;
    }
  }
}
