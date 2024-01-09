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

  override getAll(
    params: ApiParams<Ticket> & { unseen?: true } = {},
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
}
