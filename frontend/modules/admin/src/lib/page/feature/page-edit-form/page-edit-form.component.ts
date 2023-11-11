import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FileResource,
  FileService,
  PageService,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FormSubmitWrapper,
  resourceIdFromRoute,
  throwError,
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
  TuiFileLike,
  TuiInputFilesModule,
  TuiMultiSelectModule,
} from '@taiga-ui/kit';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  share,
  shareReplay,
  startWith,
  switchMap,
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
  ],
  templateUrl: './page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditFormComponent {
  private readonly _service = inject(PageService);
  private readonly _fileService = inject(FileService);
  readonly user: User =
    inject(AuthService).userSnapshot ?? throwError('User not found');

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    universityId: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: [''],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
    files: [[] as TuiFileLike[]],
    filesToRemove: [[] as Array<FileResource['id']>],
    contactRequestHandlers: [[] as Array<User['id']>],
    creatorId: [-1, [Validators.required]],
  });

  private readonly _id$ = resourceIdFromRoute();

  readonly item$ = this._id$.pipe(
    toResourceFromId(this._service, (item) => {
      this.form.patchValue({
        ...item,
        universityId: item.university.id,
        author: item.creator.firstName + ' ' + item.creator.lastName,
        creatorId: item.creator.id,
        contactRequestHandlers:
          item.contactRequestHandlers?.map((x) => x.id) ?? [],
      });
    }),
  );

  readonly files$ = this._id$.pipe(
    switchMap((id) => this._fileService.getByPage(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly confirmText$ = combineLatest([
    this.item$,
    this.form.valueChanges,
  ]).pipe(
    debounceTime(100),
    map(([item, formValue]) => {
      if (item?.hidden !== formValue.hidden) {
        return formValue.hidden
          ? 'PAGE_VISIBILITY_CHANGE_TO_HIDDEN_CONFIRMATION'
          : 'PAGE_VISIBILITY_CHANGE_TO_VISIBLE_CONFIRMATION';
      }

      return null;
    }),
    distinctUntilChanged(),
    share(),
  );

  handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'PAGE_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  rejectedFiles: readonly TuiFileLike[] = [];

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    (item) => `${item.firstName} ${item.lastName} (${item.email})`,
  );

  onReject(files: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles = [...this.rejectedFiles, ...(files as TuiFileLike[])];
  }

  removeFile({ name }: TuiFileLike): void {
    this.handler.form.controls.files.setValue(
      this.handler.form.controls.files.value?.filter(
        (current: TuiFileLike) => current.name !== name,
      ) ?? [],
    );
  }

  removeExistingFile(file: FileResource): void {
    this.handler.form.controls.filesToRemove.setValue([
      ...this.handler.form.controls.filesToRemove.value,
      file.id,
    ]);
    file.toRemove = true;
  }

  clearRejected({ name }: TuiFileLike): void {
    this.rejectedFiles = this.rejectedFiles.filter(
      (rejected) => rejected.name !== name,
    );
  }
}
