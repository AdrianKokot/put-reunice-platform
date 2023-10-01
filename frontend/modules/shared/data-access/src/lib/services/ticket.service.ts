import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Ticket, TicketMessage } from '../models/ticket';
import { User } from '../models/user';
import { BehaviorSubject, of } from 'rxjs';

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

const mockTicket: Ticket = {
  id: '24439',
  status: 'IN-PROGRESS',
  page: {
    title: 'Page title',
  },
  messages: [
    {
      author: mockUser,
      content: 'Ticket message',
      createdAtDate: '2021-08-02T12:00:00.000Z',
      seenBy: [mockUser],
    },
    {
      author: mockUser,
      content: 'Ticket message',
      createdAtDate: '2021-08-02T12:00:00.000Z',
      seenBy: [mockUser],
    },
  ],
};

interface Reply {
  id: Ticket['id'];
  content: TicketMessage['content'];
}

const ticketSubject = new BehaviorSubject<Ticket>(mockTicket);

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<Ticket, Ticket, unknown> {
  constructor() {
    super('/api/tickets');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override get(id: Ticket['id']) {
    return ticketSubject.asObservable();
  }

  send(reply: Reply) {
    const ticket = ticketSubject.getValue();
    ticketSubject.next({
      ...ticket,
      messages: [
        ...ticket.messages,
        {
          author: mockUser,
          content: reply.content,
          createdAtDate: '2021-08-02 12:00:00',
          seenBy: [],
        },
      ],
    });
    return of(ticket);
  }

  sendAndResolve(reply: Reply) {
    const ticket = ticketSubject.getValue();
    ticketSubject.next({
      ...ticket,
      status: 'RESOLVED',
      resolvedBy: mockUser,
      messages: [
        ...ticket.messages,
        {
          author: mockUser,
          content: reply.content,
          createdAtDate: '2021-08-02 12:00:00',
          seenBy: [],
        },
      ],
    });
    return of(ticket);
  }

  markAsIrrelevant(id: Ticket['id']) {
    console.log(id);
    const ticket = ticketSubject.getValue();
    ticketSubject.next({
      ...ticket,
      status: 'IRRELEVANT',
      markedIrrelevantBy: mockUser,
    });
    return of(ticket);
  }
}
