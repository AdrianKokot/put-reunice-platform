import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Ticket, TicketResponse } from '../models/ticket';
import { Observable, Subject, combineLatest, map, switchMap } from 'rxjs';

type TicketWithResponses = Ticket & { responses: TicketResponse[] };

@Injectable({
  providedIn: 'root',
})
export class TicketService extends AbstractApiService<TicketWithResponses> {
  constructor() {
    super('/api/tickets');
  }

  private readonly ticketSubject = new Subject<Ticket>();
  private readonly responsesSubject = new Subject<TicketResponse[]>();

  private fetchTicket(id: Ticket['id']) {
    const refetch = super.get(id);
    refetch.subscribe((ticket) => this.ticketSubject.next(ticket));
    return refetch;
  }

  private fetchResponses(id: Ticket['id']) {
    const refetch = this._http.get<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
    );
    refetch.subscribe((responses) => this.responsesSubject.next(responses));
    return refetch;
  }

  override get(id: Ticket['id']) {
    this.fetchTicket(id);
    this.fetchResponses(id);
    return combineLatest([this.ticketSubject, this.responsesSubject]).pipe(
      map(([ticket, responses]) => ({ ...ticket, responses })),
    );
  }

  send({
    id,
    content,
  }: {
    id: Ticket['id'];
    content: TicketResponse['content'];
  }): Observable<TicketResponse[]> {
    const sendMutation = this._http.post<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
      { content },
    );
    return sendMutation.pipe(switchMap(() => this.fetchResponses(id)));
  }

  sendAndResolve(response: { id: Ticket['id']; content: string }) {
    return this.send(response).pipe(
      switchMap(() => this.changeStatus(response.id, 'RESOLVED')),
      switchMap(() => this.fetchTicket(response.id)),
    );
  }

  markAsIrrelevant(id: Ticket['id']) {
    return this.changeStatus(id, 'IRRELEVANT').pipe(
      switchMap(() => this.fetchTicket(id)),
    );
  }

  markAsDeleted(id: Ticket['id']) {
    return this.changeStatus(id, 'DELETED').pipe(
      switchMap(() => this.fetchTicket(id)),
    );
  }

  changeStatus(id: string, status: Ticket['status']) {
    return this._http.put(`${this._resourceUrl}/${id}`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
