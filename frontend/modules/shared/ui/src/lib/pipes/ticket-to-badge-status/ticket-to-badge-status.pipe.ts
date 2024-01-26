import { Pipe, PipeTransform } from '@angular/core';
import { Ticket } from '@eunice/modules/shared/data-access';
import { TuiStatus } from '@taiga-ui/kit';

@Pipe({
  name: 'ticketToBadgeStatus',
  pure: true,
})
export class TicketToBadgeStatusPipe implements PipeTransform {
  transform({ status }: Ticket): TuiStatus {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'HANDLED':
        return 'neutral';
      case 'IRRELEVANT':
        return 'warning';
      case 'DELETED':
        return 'error';
      case 'RESOLVED':
        return 'success';
      default:
        return 'neutral';
    }
  }
}
