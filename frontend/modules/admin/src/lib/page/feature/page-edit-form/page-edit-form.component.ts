import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  PageService,
  Resource,
  ResourceService,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FormSubmitWrapper,
  resourceIdFromRoute,
  toResourceFromId,
} from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { LoadTemplateComponent } from '../../../shared/editor-extensions/load-template/load-template.component';
import {
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiInputFilesModule,
  TuiMultiSelectModule,
} from '@taiga-ui/kit';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  AuthService,
  UserControlsResourceDirective,
  UserDirective,
} from '@reunice/modules/shared/security';
import {
  ConfirmDirective,
  LocalizedPipeModule,
} from '@reunice/modules/shared/ui';
import { HtmlEditorComponent } from '../../../shared/editor-extensions/html-editor/html-editor.component';
import { TuiDropdownModule } from '@taiga-ui/core';

@Component({
  selector: 'reunice-page-edit-form',
  standalone: true,
  imports: [
    TuiLetModule,
    BaseFormImportsModule,
    TuiEditorModule,
    LoadTemplateComponent,
    TuiInputFilesModule,
    LocalizedPipeModule,
    TuiCheckboxLabeledModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    ConfirmDirective,
    TuiComboBoxModule,
    UserControlsResourceDirective,
    UserDirective,
    HtmlEditorComponent,
    TuiDropdownModule,
  ],
  templateUrl: './page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditFormComponent {
  private readonly _service = inject(PageService);
  private readonly _resourceService = inject(ResourceService);
  readonly user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    universityId: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: [''],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
    contactRequestHandlers: [[] as Array<User['id']>],
    creatorId: [-1, [Validators.required]],
    resources: [[] as Array<Resource['id']>],
  });

  private readonly _id$ = resourceIdFromRoute();

  readonly resources$ = this._id$.pipe(
    switchMap((pageId) =>
      this._resourceService.getByPage(pageId).pipe(
        tap((resources) => {
          this.form.patchValue({ resources: resources.map((x) => x.id) });
          this.resourceSearch.addItems(resources);
        }),
        startWith(null),
      ),
    ),
    shareReplay(1),
  );

  readonly item$ = this._id$.pipe(
    toResourceFromId(this._service, (item) => {
      this.form.patchValue({
        ...item,
        universityId: item.university.id,
        author: `${item.creator.firstName} ${item.creator.lastName}`,
        creatorId: item.creator.id,
        contactRequestHandlers:
          item.contactRequestHandlers?.map((x) => x.id) ?? [],
      });
      this.userSearch.addItem(item.creator);
      this.contactRequestHandlerSearch.addItems(item.contactRequestHandlers);
    }),
  );

  readonly confirmText$ = combineLatest([
    this.item$,
    this.form.controls.hidden.valueChanges,
  ]).pipe(
    map(([item, hidden]) => {
      if (item?.hidden === hidden) return null;

      return hidden
        ? 'PAGE_VISIBILITY_CHANGE_TO_HIDDEN_CONFIRMATION'
        : 'PAGE_VISIBILITY_CHANGE_TO_VISIBLE_CONFIRMATION';
    }),
    distinctUntilChanged(),
  );

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'PAGE_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    (item) => `${item.firstName} ${item.lastName} (${item.email})`,
    { enrolledUniversities_eq: this.user.universityId },
    [this.user],
  );

  readonly resourceSearch = new ResourceSearchWrapper(
    this._resourceService,
    'search',
    (item) => `${item.name} (${item.author.firstName} ${item.author.lastName})`,
    { universityId_eq: this.user.universityId },
  );

  readonly contactRequestHandlerSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    (item) => `${item.firstName} ${item.lastName} (${item.email})`,
  );

  protected readonly AccountTypeEnum = AccountTypeEnum;
}
