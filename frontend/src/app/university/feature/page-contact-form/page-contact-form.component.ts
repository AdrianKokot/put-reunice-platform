import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiComboBoxModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import {
  FormSubmitWrapper,
  resourceIdFromRoute,
} from '@reunice/modules/shared/util';
import { PageService } from '@reunice/modules/shared/data-access';
import { first, switchMap } from 'rxjs';

@Component({
  selector: 'reunice-page-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiComboBoxModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLabelModule,
    TuiTextareaModule,
  ],
  templateUrl: './page-contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContactFormComponent {
  private readonly _service = inject(PageService);
  private readonly _pageId$ = resourceIdFromRoute('pageId');

  readonly form = inject(FormBuilder).nonNullable.group({
    pageId: [],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    email: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.email],
    ],
    content: ['', [Validators.required, Validators.maxLength(255)]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) =>
      this._pageId$.pipe(
        switchMap((pageId) => this._service.sendQuestion(pageId, value)),
        first(),
      ),
    successAlertMessage: 'SEND_QUESTION_SUCCESS',
  });
}
