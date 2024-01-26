import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideeuniceTable,
  AbstractTable,
} from '../../../shared';
import {
  FormNotEmptyValuesPipeModule,
  TicketToBadgeStatusModule,
} from '@eunice/modules/shared/ui';
import { FormBuilder } from '@angular/forms';
import { Ticket, TicketService } from '@eunice/modules/shared/data-access';
import { TuiBadgeModule } from '@taiga-ui/kit';

@Component({
  selector: 'eunice-ticket-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
    TuiBadgeModule,
    TicketToBadgeStatusModule,
  ],
  templateUrl: './ticket-list.component.html',
  providers: [provideeuniceTable(TicketService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListComponent extends AbstractTable<Ticket> {
  readonly columns: Array<keyof Ticket | string> = [
    'title',
    'requestedTime',
    'requesterEmail',
    'status',
    'actions',
  ];

  readonly filtersForm = inject(FormBuilder).nonNullable.group({
    search: [''],
    status_eq: [null as Ticket['status'] | null],
    requestedTime_eq: [null as Date | null],
  });
}
