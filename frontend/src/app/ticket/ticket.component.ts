import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiAvatarModule,
  TuiIslandModule,
  tuiAvatarOptionsProvider,
  TuiTextareaModule,
  TuiBadgeModule,
} from '@taiga-ui/kit';
import { TuiGroupModule, TuiButtonModule } from '@taiga-ui/core';
import { resourceIdFromRoute } from '@reunice/modules/shared/util';
import { CommonModule } from '@angular/common';
import {
  Ticket,
  TicketResponse,
  TicketService,
} from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { LocalizedPipeModule } from '@reunice/modules/shared/ui';
import {
  Subject,
  combineLatest,
  filter,
  map,
  merge,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { TicketToBadgeStatusModule } from '@reunice/modules/shared/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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
  readonly token = inject(ActivatedRoute).snapshot.queryParams['token'];

  private readonly _changeStatusRequest$ = new Subject<Ticket['status']>();
  private readonly _sendResponseRequest$ = new Subject<
    TicketResponse['content']
  >();

  readonly _changeStatus$ = combineLatest([
    this._id$,
    this._changeStatusRequest$,
  ]).pipe(
    switchMap(([id, status]) =>
      this._service.changeStatus(id, status).pipe(startWith(null)),
    ),
    shareReplay(),
  );

  readonly _sendResponse$ = combineLatest([
    this._id$,
    this._sendResponseRequest$,
  ]).pipe(
    switchMap(([id, content]) =>
      this._service.sendResponse(id, content, this.token).pipe(startWith(null)),
    ),
    shareReplay(),
  );

  ticket$ = merge(this._id$, this._changeStatus$).pipe(
    switchMap(() => this._id$),
    switchMap((id) => this._service.get(id, this.token).pipe(startWith(null))),
    shareReplay(),
  );
  ticketKeepPrevious$ = this.ticket$.pipe(filter((data) => Boolean(data)));

  responses$ = merge(this._id$, this._sendResponse$).pipe(
    switchMap(() => this._id$),
    switchMap((id) =>
      this._service.getResponses(id, this.token).pipe(startWith(null)),
    ),
    shareReplay(),
  );
  responsesKeepPrevious$ = this.responses$.pipe(
    filter((data) => Boolean(data)),
  );

  loading$ = combineLatest([
    this.ticket$,
    this._changeStatus$.pipe(startWith('up-to-date')),
    this.responses$,
    this._sendResponse$.pipe(startWith('up-to-date')),
  ]).pipe(
    map((requests) => requests.some((request) => !request)),
    startWith(false),
    shareReplay(),
  );

  readonly responseForm = inject(FormBuilder).nonNullable.group({
    content: ['', [Validators.required]],
  });

  sendResponse = () => {
    const { content } = this.responseForm.value;
    if (content) {
      this._sendResponseRequest$.next(content);
      this.responseForm.reset();
    }
  };

  changeStatus = (status: Ticket['status']) =>
    this._changeStatusRequest$.next(status);
}
