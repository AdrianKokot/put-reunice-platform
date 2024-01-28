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
import {
  TuiAlertService,
  TuiButtonModule,
  TuiGroupModule,
  TuiHintModule,
} from '@taiga-ui/core';
import { resourceIdFromRoute } from '@eunice/modules/shared/util';
import { CommonModule } from '@angular/common';
import {
  Ticket,
  TicketResponse,
  TicketService,
} from '@eunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  LocalizedPipeModule,
  TicketToBadgeStatusModule,
} from '@eunice/modules/shared/ui';
import {
  catchError,
  combineLatest,
  concat,
  filter,
  map,
  merge,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'eunice-ticket',
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
    TuiHintModule,
  ],
  providers: [tuiAvatarOptionsProvider({ autoColor: true })],
})
export class TicketComponent {
  private readonly _alert = inject(TuiAlertService);
  private readonly _translate = inject(TranslateService);

  private readonly catchError = (err: unknown) => {
    if (err instanceof HttpErrorResponse && err.status === 400) {
      this._alert
        .open(this._translate.instant(err.error.message), {
          status: 'error',
        })
        .subscribe();
    }

    return of([]);
  };

  private readonly _id$ = resourceIdFromRoute();
  private readonly _service = inject(TicketService);
  readonly token = inject(ActivatedRoute).snapshot.queryParams['token'];

  private readonly _changeRequest$ = new Subject<{
    status?: Ticket['status'];
    content?: TicketResponse['content'];
  }>();

  readonly _change$ = this._changeRequest$.pipe(
    withLatestFrom(this._id$),
    switchMap(([request, id]) => {
      const responseChange = request.content
        ? this._service
            .sendResponse(id, request.content)
            .pipe(catchError((e) => this.catchError(e)))
        : of(false);
      const statusChange = request.status
        ? this._service
            .changeStatus(id, request.status)
            .pipe(catchError((e) => this.catchError(e)))
        : of(false);

      return concat(responseChange, statusChange).pipe(startWith(null));
    }),
    shareReplay(1),
  );
  readonly ticket$ = merge(this._id$, this._change$).pipe(
    switchMap(() => this._id$),
    switchMap((id) => this._service.get(id, this.token).pipe(startWith(null))),
    shareReplay(1),
  );
  readonly ticketKeepPrevious$ = this.ticket$.pipe(
    filter((data) => Boolean(data)),
  );

  readonly responses$ = merge(this._id$, this._change$).pipe(
    switchMap(() => this._id$),
    switchMap((id) =>
      this._service.getResponses(id, this.token).pipe(
        catchError((e) => this.catchError(e)),
        startWith(null),
      ),
    ),
    shareReplay(1),
  );
  readonly responsesKeepPrevious$ = this.responses$.pipe(
    filter((data) => Boolean(data)),
  );

  readonly loading$ = combineLatest([
    this.ticket$,
    this.responses$,
    this._change$.pipe(startWith(false)),
  ]).pipe(
    map((requests) => requests.some((r) => r === null)),
    startWith(false),
    shareReplay(1),
  );

  readonly responseForm = inject(FormBuilder).nonNullable.group({
    content: ['', [Validators.required]],
  });

  sendResponse = () => {
    const { content } = this.responseForm.value;
    if (content) {
      this._changeRequest$.next({ content });
      this.responseForm.reset();
    }
  };

  changeStatus = (status: Ticket['status']) => {
    const { content } = this.responseForm.value;
    this._changeRequest$.next({ status, content });
    this.responseForm.reset();
  };
}
