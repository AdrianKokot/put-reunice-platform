import { NgModule } from '@angular/core';
import { TicketToBadgeStatusPipe } from './ticket-to-badge-status.pipe';

@NgModule({
  declarations: [TicketToBadgeStatusPipe],
  exports: [TicketToBadgeStatusPipe],
})
export class TicketToBadgeStatusModule {}
