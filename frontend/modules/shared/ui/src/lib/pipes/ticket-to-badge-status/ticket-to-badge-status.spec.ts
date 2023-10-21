import { TicketToBadgeStatusPipe } from './ticket-to-badge-status.pipe';

describe('TicketToBadgeStatus', () => {
  let pipe: TicketToBadgeStatusPipe;

  beforeEach(() => {
    pipe = new TicketToBadgeStatusPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
