import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';

@Component({
  selector: 'reunice-page-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    ReactiveFormsModule,
    TranslateModule,
    TuiLabelModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiTextAreaModule,
    RouterLink,
    TuiEditorModule,
    TuiButtonModule,
  ],
  templateUrl: './page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditFormComponent {
  private readonly _service = inject(PageService);
  private readonly _alert = inject(TuiAlertService);

  readonly item$ = resourceFromRoute(this._service, (item) => {
    this.form.patchValue({
      ...item,
      author: item.creator.firstName + ' ' + item.creator.lastName,
    });
  });

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
  });
  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    effect: (result) => {
      this.form.patchValue(result);

      return this._alert.open('Page updated successfully', {
        status: TuiNotification.Success,
      });
    },
  });
}
