import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
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
  ],
})
export class TicketComponent {
  private readonly _id$ = resourceIdFromRoute();

  private readonly _service = inject(TicketService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: ['1', [Validators.required]],
    content: ['', [Validators.required]],
  });

  readonly ticket$ = this._id$.pipe(
    toResourceFromId(this._service, (item) => {
      this.form.patchValue({ ...item });
    }),
  );

  readonly sendHandler = new FormSubmitWrapper(this.form, {
    submit: (values) => this._service.send(values),
    successAlertMessage: 'REPLY_SEND_SUCCESS',
  });

  readonly sendAndResolveHandler = new FormSubmitWrapper(this.form, {
    submit: (values) => this._service.sendAndResolve(values),
    successAlertMessage: 'REPLY_AND_RESOLVE_SEND_SUCCESS',
  });

  readonly markAsIrrelevantHandler = new FormSubmitWrapper(this.form, {
    submit: (values) => this._service.markAsIrrelevant(values.id),
    successAlertMessage: 'MARK_AS_IRRELEVANT_SUCCESS',
  });
}
