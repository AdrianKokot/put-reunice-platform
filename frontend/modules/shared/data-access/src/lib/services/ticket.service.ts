import { Injectable } from '@angular/core';
import {
  AbstractApiService,
  TOTAL_ITEMS_HEADER,
  toHttpParams,
} from './abstract-api.service';
import { Ticket, TicketResponse } from '../models/ticket';
import { Observable, map } from 'rxjs';
import { ApiParams, ApiPaginatedResponse } from '../api.params';

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

  override getAll(
    params: ApiParams<Omit<Ticket, 'lastSeenOn' | 'lastStatusChangeBy'>> & {
      handler?: true;
    } = {},
  ): Observable<ApiPaginatedResponse<Ticket>> {
    return this._http
      .get<Ticket[]>(this._resourceUrl, {
        params: toHttpParams(params),
        observe: 'response',
      })
      .pipe(
        map(
          ({ body, headers }): ApiPaginatedResponse<Ticket> => ({
            totalItems: Number(headers.get(TOTAL_ITEMS_HEADER)),
            items: body ?? [],
          }),
        ),
      );
  }

  getResponses(id: Ticket['id'], token?: Token) {
    return this._http.get<TicketResponse[]>(
      `${this._resourceUrl}/${id}/responses`,
      { params: toHttpParams({ token }) },
    );
  }

  sendResponse(
    id: Ticket['id'],
    content: TicketResponse['content'],
    token?: Token,
  ): Observable<boolean> {
    return this._http
      .post(
        `${this._resourceUrl}/${id}/responses`,
        { content },
        { params: toHttpParams({ token }), observe: 'response' },
      )
      .pipe(map(({ status }) => status >= 200 && status < 300));
  }

  changeStatus(id: string, status: Ticket['status']) {
    return this._http.put(`${this._resourceUrl}/${id}`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
