import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from '@reunice/modules/shared/data-access';
import { TuiStatus } from '@taiga-ui/kit';

@Pipe({
  name: 'ticketToBadgeStatus',
  pure: true,
})
export class TicketToBadgeStatusPipe implements PipeTransform {
  transform({ status }: Ticket): TuiStatus {
    switch (status) {
      case 'NEW':
        return 'success';
      default:
        return 'info';
    }
  }
}
