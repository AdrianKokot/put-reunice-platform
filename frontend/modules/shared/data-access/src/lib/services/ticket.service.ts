import { Injectable } from '@angular/core';
import { AbstractApiService, toHttpParams } from './abstract-api.service';
import { Ticket, TicketResponse } from '../models/ticket';
import { Observable } from 'rxjs';

type TicketCreatePayload = Pick<
  Ticket,
  'pageId' | 'title' | 'description' | 'requesterEmail'
>;

type Token = string;

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<
  Ticket,
  TicketCreatePayload
> {
  constructor() {
    super('/api/tickets');
  }

  override get(id: Ticket['id'], token?: Token) {
    return this._http.get<Ticket>(`${this._resourceUrl}/${id}`, {
      params: toHttpParams({ token }),
    });
  }

  createTicket(resource: Partial<TicketCreatePayload>) {
    return this._http.post<{ ticketId: Ticket['id']; ticketToken: Token }>(
      this._resourceUrl,
      resource,
    );
  }

  getResponses(id: Ticket['id'], token?: string) {
    return this._http.get<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
      { params: toHttpParams({ token }) },
    );
  }

  sendResponse(
    id: Ticket['id'],
    content: TicketResponse['content'],
    token?: Token,
  ): Observable<TicketResponse[]> {
    return this._http.post<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
      { content },
      { params: toHttpParams({ token }) },
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
}
