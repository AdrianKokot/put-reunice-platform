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

  open = false;

  clickedNotifications$ = new Subject<string>();
  recentlyViewedIds$ = this.clickedNotifications$.pipe(
    tap(() => (this.open = false)),
    scan((acc, id) => [...acc, id], [] as string[]),
    startWith([] as string[]),
  );

  tickets$ = this._service.getAll({ unseen_eq: true, page: 0, size: 5 });
  optimisticTickets$ = combineLatest([
    this.tickets$,
    this.recentlyViewedIds$,
  ]).pipe(
    map(([tickets, recentlyViewedIds]) =>
      tickets.items.filter(({ id }) => !recentlyViewedIds.includes(id)),
    ),
  );
}
