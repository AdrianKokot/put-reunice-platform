import { User } from './user';
import { Page } from './page';

export type TicketStatus =
  | {
      status: 'IN-PROGRESS';
    }
  | {
      status: 'RESOLVED';
      resolvedBy: User;
    }
  | {
      status: 'IRRELEVANT';
      markedIrrelevantBy: User;
    }
  | {
      status: 'DELETED';
      deletedBy: User;
    };

export interface TicketMessage {
  author: User;
  content: string;
  createdAtDate: string;
  seenBy: User[];
}

export type Ticket = {
  id: string;
  page: Pick<Page, 'title'>;
  messages: TicketMessage[];
} & TicketStatus;
