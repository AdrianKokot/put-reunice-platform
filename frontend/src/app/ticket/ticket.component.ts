import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiAvatarModule,
  tuiAvatarOptionsProvider,
  TuiBadgeModule,
  TuiIslandModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiGroupModule } from '@taiga-ui/core';
import { resourceIdFromRoute } from '@reunice/modules/shared/util';
import { CommonModule } from '@angular/common';
import {
  Ticket,
  TicketResponse,
  TicketService,
} from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
<<<<<<< HEAD
  LocalizedPipeModule,
  TicketToBadgeStatusModule,
} from '@reunice/modules/shared/ui';
import {
=======
  EMPTY,
  Subject,
  catchError,
>>>>>>> 4df5d57c0c3bbf72a7b0e0699032e29396db2264
  combineLatest,
  filter,
  map,
  merge,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  private readonly _router = inject(Router);
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
      this._service.changeStatus(id, status).pipe(
        map(() => 'up-to-date'),
        startWith(null),
      ),
    ),
    shareReplay(),
  );

  readonly _sendResponse$ = combineLatest([
    this._id$,
    this._sendResponseRequest$,
  ]).pipe(
    switchMap(([id, content]) =>
      this._service.sendResponse(id, content, this.token).pipe(
        map(() => 'up-to-date'),
        startWith(null),
      ),
    ),
    shareReplay(),
  );

  ticket$ = merge(this._id$, this._changeStatus$, this._sendResponse$).pipe(
    switchMap(() => this._id$),
    switchMap((id) =>
      this._service.get(id, this.token).pipe(
        catchError(() => {
          this._router.navigate(['not-found']);
          return EMPTY;
        }),
        startWith(null),
      ),
    ),
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
