import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BaseFormImportsModule,
  BaseTableImportsModule,
  provideReuniceTable,
  ReuniceAbstractTable,
} from '../../../shared';
import {
  FormNotEmptyValuesPipeModule,
  TicketToBadgeStatusModule,
} from '@reunice/modules/shared/ui';
import { FormBuilder } from '@angular/forms';
import { Ticket, TicketService } from '@reunice/modules/shared/data-access';
import { TuiBadgeModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-ticket-list',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    BaseTableImportsModule,
    FormNotEmptyValuesPipeModule,
    TuiBadgeModule,
    TicketToBadgeStatusModule,
  ],
  templateUrl: './ticket-list.component.html',
  providers: [provideReuniceTable(TicketService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListComponent extends ReuniceAbstractTable<Ticket> {
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
