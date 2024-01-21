import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiBadgeModule, TuiBadgedContentModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiDataListModule,
} from '@taiga-ui/core';
import { TicketService } from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { TuiLetModule } from '@taiga-ui/cdk';
import { Subject, combineLatest, map, scan, startWith, tap } from 'rxjs';
import { TicketToBadgeStatusModule } from '../../pipes/ticket-to-badge-status/ticket-to-badge-status.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-notifications',
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiBadgedContentModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    RouterLink,
    TuiLoaderModule,
    TuiLetModule,
    TicketToBadgeStatusModule,
    TuiBadgeModule,
    TranslateModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  private readonly _service = inject(TicketService);
  private readonly _user$ = inject(AuthService).user$;

  open = false;

  clickedNotifications$ = new Subject<string>();
  recentlyViewedIds$ = this.clickedNotifications$.pipe(
    tap(() => (this.open = false)),
    scan((acc, id) => [...acc, id], [] as string[]),
    startWith([] as string[]),
  );

  tickets$ = this._service.getAll({
    handler: true,
    page: 0,
    size: 5,
    sort: 'lastUpdateTime,desc',
  });

  optimisticTickets$ = combineLatest([
    this.tickets$,
    this.recentlyViewedIds$,
    this._user$,
  ]).pipe(
    map(([tickets, recentlyViewedIds, user]) =>
      tickets.items.map((ticket) => {
        const isOptimisticallySeen = recentlyViewedIds.includes(ticket.id);
        const lastSeenOnDate =
          user && new Date(ticket.lastSeenOn[user?.username]);
        const lastUpdateTimeDate = new Date(ticket.lastUpdateTime);

        const isLastUpdateSeen = Boolean(
          lastSeenOnDate && lastSeenOnDate >= lastUpdateTimeDate,
        );

        const isSeen = isLastUpdateSeen || isOptimisticallySeen;

        return {
          ...ticket,
          isSeen,
        };
      }),
    ),
  );

  unseenTicketsCount$ = this.optimisticTickets$.pipe(
    map((tickets) => tickets.filter((ticket) => !ticket.isSeen).length),
  );
}
