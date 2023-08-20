import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Keyword } from '../models/keyword';
import { AbstractApiService, toHttpParams } from './abstract-api.service';
import { ApiParams } from '../api.params';

@Injectable({
  providedIn: 'root',
})
export class KeyWordsService extends AbstractApiService<Keyword> {
  constructor() {
    super('/api/keyWords');
  }

  override update(
    resource: Partial<Keyword> & Pick<Keyword, 'id'>
  ): Observable<Keyword> {
    return this._http
      .post<void>(`${this._resourceUrl}/${resource.id}`, resource.word)
      .pipe(switchMap(() => this.get(resource.id)));
  }

  override create(resource: Partial<Keyword>): Observable<Keyword> {
    return super.create(resource.word as unknown as Keyword);
  }

  override getAll(
    params: ApiParams<Keyword> | ApiParams = {}
  ): Observable<Keyword[]> {
    return this._http.get<Keyword[]>(this._resourceUrl + '/all', {
      params: toHttpParams(params),
    });
  }
}
