import { User } from './user';
import { Page } from './page';

export type TicketStatus =
  | 'IN-PROGRESS'
  | 'RESOLVED'
  | 'IRRELEVANT'
  | 'DELETED';

export interface TicketMessage {
  author: User;
  content: string;
  isRead: boolean;
  createdAtDate: string;
}
export interface Ticket {
  id: string;
  status: TicketStatus;
  page: Omit<Page, 'university'>;
  messages: TicketMessage[];
}
