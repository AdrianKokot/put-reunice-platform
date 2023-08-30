import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { LoadTemplateComponent } from '../../../shared/editor-extensions/load-template/load-template.component';
import { TuiExpandModule } from '@taiga-ui/core';
import {
  TuiElasticContainerModule,
  TuiFileLike,
  TuiInputFilesModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'reunice-page-edit-form',
  standalone: true,
  imports: [
    TuiLetModule,
    BaseFormImportsModule,
    TuiEditorModule,
    LoadTemplateComponent,
    TuiExpandModule,
    TuiElasticContainerModule,
    TuiInputFilesModule,
  ],
  templateUrl: './page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditFormComponent {
  private readonly _service = inject(PageService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
    files: [[] as TuiFileLike[]],
  });

  readonly item$ = resourceFromRoute(this._service, (item) => {
    this.form.patchValue({
      ...item,
      author: item.creator.firstName + ' ' + item.creator.lastName,
    });
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'PAGE_UPDATE_SUCCESS',
  });

  rejectedFiles: readonly TuiFileLike[] = [];

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

  clearRejected({ name }: TuiFileLike): void {
    this.rejectedFiles = this.rejectedFiles.filter(
      (rejected) => rejected.name !== name,
    );
  }
}
