import { Page } from './page';

export interface Ticket {
  id: string;
  description: string;
  pageId: Page['id'];
  requestedTime: string;
  requesterEmail: string;
  status: string;
  title: string;
}

export interface TicketResponse {
  id: number;
  author: string;
  responseTime: string;
  content: string;
}
