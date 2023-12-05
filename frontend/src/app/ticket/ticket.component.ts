import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  TuiAvatarModule,
  TuiIslandModule,
  tuiAvatarOptionsProvider,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/kit';
import { TuiGroupModule } from '@taiga-ui/core';
import { TuiButtonModule } from '@taiga-ui/core';
import {
  FormSubmitWrapper,
  resourceIdFromRoute,
  toResourceFromId,
} from '@reunice/modules/shared/util';
import { CommonModule } from '@angular/common';
import { TicketService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { LocalizedPipeModule } from '@reunice/modules/shared/ui';
import { of } from 'rxjs';
import { TicketToBadgeStatusModule } from '@reunice/modules/shared/ui';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'reunice-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiAvatarModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiGroupModule,
    TuiButtonModule,
    TuiLetModule,
    TuiBadgeModule,
    LocalizedPipeModule,
    TicketToBadgeStatusModule,
    TranslateModule,
  ],
  providers: [tuiAvatarOptionsProvider({ autoColor: true })],
})
export class TicketComponent {
  private readonly _id$ = resourceIdFromRoute();
  private readonly _service = inject(TicketService);

  readonly responseForm = inject(FormBuilder).nonNullable.group({
    id: ['1', [Validators.required]],
    content: ['', [Validators.required]],
  });

  readonly changeStatusForm = inject(FormBuilder).nonNullable.group({
    id: ['1', [Validators.required]],
  });

  readonly ticket$ = this._id$.pipe(
    toResourceFromId(this._service, (item) => {
      this.responseForm.patchValue({ ...item });
      this.changeStatusForm.patchValue({ ...item });
    }),
  );

  readonly sendHandler = new FormSubmitWrapper(this.responseForm, {
    submit: (values) => this._service.send(values),
    effect: (response) => {
      this.responseForm.reset({ content: '', id: this.responseForm.value.id });
      return of(response);
    },
    successAlertMessage: 'TICKET_REPLY_SUCCESS',
  });

  readonly sendAndResolveHandler = new FormSubmitWrapper(this.responseForm, {
    submit: (values) => this._service.sendAndResolve(values),
    effect: (response) => {
      this.responseForm.reset({ content: '', id: this.responseForm.value.id });
      return of(response);
    },
    successAlertMessage: 'TICKET_REPLY_AND_RESOLVE_SUCCESS',
  });

  readonly markAsIrrelevantHandler = new FormSubmitWrapper(
    this.changeStatusForm,
    {
      submit: (values) => this._service.markAsIrrelevant(values.id),
      successAlertMessage: 'TICKET_MARK_IRRELEVANT_SUCCESS',
    },
  );

  readonly markAsDeletedHandler = new FormSubmitWrapper(this.changeStatusForm, {
    submit: (values) => this._service.markAsDeleted(values.id),
    successAlertMessage: 'TICKET_MARK_DELETED_SUCCESS',
  });
}
