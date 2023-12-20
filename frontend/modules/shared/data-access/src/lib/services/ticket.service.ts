import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Ticket, TicketResponse } from '../models/ticket';
import { Observable } from 'rxjs';

type CreateTicketDto = Pick<
  Ticket,
  'pageId' | 'title' | 'description' | 'requesterEmail'
>;

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<Ticket> {
  constructor() {
    super('/api/tickets');
  }

  getResponses(id: Ticket['id']) {
    return this._http.get<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
    );
  }

  sendResponse(
    id: Ticket['id'],
    content: TicketResponse['content'],
  ): Observable<TicketResponse[]> {
    return this._http.post<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
      { content },
    );
  }

  markAsIrrelevant(id: Ticket['id']) {
    return this.changeStatus(id, 'IRRELEVANT');
  }

  markAsDeleted(id: Ticket['id']) {
    return this.changeStatus(id, 'DELETED');
  }

  changeStatus(id: string, status: Ticket['status']) {
    return this._http.put(`${this._resourceUrl}/${id}`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  createTicket(newTicket: CreateTicketDto) {
    return this._http.post(`${this._resourceUrl}`, newTicket);
  }
}
