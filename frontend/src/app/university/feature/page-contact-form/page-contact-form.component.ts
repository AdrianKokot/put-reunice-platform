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
import { TicketService } from '@reunice/modules/shared/data-access';
import { first, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

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
  private readonly _service = inject(TicketService);
  private readonly _pageId$ = resourceIdFromRoute('pageId');
  private readonly _router = inject(Router);

  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    requesterEmail: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.email],
    ],
    description: ['', [Validators.required, Validators.maxLength(255)]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) =>
      this._pageId$.pipe(
        switchMap((pageId) =>
          this._service.createTicket({
            ...value,
            pageId: parseInt(pageId),
          }),
        ),
        first(),
      ),
    effect: ({ ticketId, ticketToken }) =>
      fromPromise(
        this._router.navigate(['tickets', ticketId], {
          queryParams: { token: ticketToken },
        }),
      ),
    successAlertMessage: 'SEND_QUESTION_SUCCESS',
  });
}
