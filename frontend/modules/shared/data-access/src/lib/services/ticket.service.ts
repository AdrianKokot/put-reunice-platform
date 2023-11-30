import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Ticket, TicketResponse } from '../models/ticket';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<Ticket> {
  constructor() {
    super('/api/tickets');
  }

  getResponses(id: Ticket['id']): Observable<TicketResponse[]> {
    return this._http.get<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
    );
  }

  send({
    id,
    content,
  }: {
    id: Ticket['id'];
    content: TicketResponse['content'];
  }): Observable<TicketResponse[]> {
    return this._http.post<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
      { content },
    );
  }

  sendAndResolve(response: { id: string; content: string }) {
    return of(response);
  }

  markAsIrrelevant(id: string) {
    return of(id);
  }
}
