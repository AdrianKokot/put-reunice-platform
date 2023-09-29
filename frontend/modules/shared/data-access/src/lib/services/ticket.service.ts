import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Ticket } from '../models/ticket';
import { User } from '../models/user';
import { Page } from '../models/page';
import { of } from 'rxjs';

const mockUser = {
  id: 1,
  email: 'johndoe@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  accountType: 'USER',
  description: 'I am John Doe',
  enabled: true,
  enrolledUniversities: [],
  lastLoginDate: '2021-08-02T12:00:00.000Z',
  name: 'John Doe',
  password: 'password?',
  phoneNumber: '1234567890',
} satisfies User;

const mockPage = {
  id: 4,
  title: 'Page title - this could be breadcrumbs?',
  content: 'Page content',
  hidden: false,
  children: [],
  createdOn: '2021-08-02T12:00:00.000Z',
  creator: mockUser,
  description: 'Page description',
  keyWords: 'key words',
  parent: null,
  updatedOn: '2021-08-02T12:00:00.000Z',
} satisfies Omit<Page, 'university'>;

const mockTicket = {
  id: '24439',
  status: 'IN-PROGRESS',
  page: mockPage,
  messages: [
    {
      author: mockUser,
      content: 'Ticket message',
      isRead: false,
      createdAtDate: '2021-08-02 12:00:00',
    },
    {
      author: mockUser,
      content: 'Ticket message',
      isRead: false,
      createdAtDate: '2021-08-02 12:00:00',
    },
  ],
} satisfies Ticket;

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<Ticket, Ticket, unknown> {
  constructor() {
    super('/api/tickets');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override get(id: Ticket['id']) {
    return of(mockTicket);
  }
}
