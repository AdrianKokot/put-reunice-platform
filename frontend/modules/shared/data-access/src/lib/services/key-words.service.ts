import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Keyword } from '../models/keyword';
import {
  AbstractApiService,
  toHttpParams,
  TOTAL_ITEMS_HEADER,
} from './abstract-api.service';
import { ApiPaginatedResponse, ApiParams } from '../api.params';

@Injectable({
  providedIn: 'root',
})
export class KeyWordsService extends AbstractApiService<Keyword> {
  constructor() {
    super('/api/keyWords');
  }

  override update(
    resource: Partial<Keyword> & Pick<Keyword, 'id'>,
  ): Observable<Keyword> {
    return this._http
      .post<void>(`${this._resourceUrl}/${resource.id}`, resource.word)
      .pipe(switchMap(() => this.get(resource.id)));
  }

  override create(resource: Partial<Keyword>): Observable<Keyword> {
    return super.create(resource.word as unknown as Keyword);
  }

  override getAll(params: ApiParams<Keyword> = {}) {
    return this._http
      .get<Keyword[]>(this._resourceUrl + '/all', {
        params: toHttpParams(params),
        observe: 'response',
      })
      .pipe(
        map(
          ({ body, headers }): ApiPaginatedResponse<Keyword> => ({
            totalItems: Number(headers.get(TOTAL_ITEMS_HEADER)),
            items: body ?? [],
          }),
        ),
      );
  }
}
