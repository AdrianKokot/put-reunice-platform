import { Page } from './page';

export interface Ticket {
  id: string;
  description: string;
  pageId: Page['id'];
  requestedTime: string;
  requesterEmail: string;
  status: 'NEW' | 'HANDLED' | 'IRRELEVANT' | 'RESOLVED' | 'DELETED';
  title: string;
  unseen: boolean;
}

export interface TicketResponse {
  id: number;
  author: string;
  responseTime: string;
  content: string;
}
