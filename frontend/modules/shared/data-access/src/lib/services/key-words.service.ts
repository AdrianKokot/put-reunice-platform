import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Keyword } from '../models/keyword';
import { AbstractApiService } from './abstract-api.service';
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
    return super.create(resource.word as any);
  }

  override getAll(
    params: ApiParams<Keyword> | ApiParams = {}
  ): Observable<Keyword[]> {
    return this._http.get<Keyword[]>(this._resourceUrl + '/all', {
      params: new HttpParams({ fromObject: params }),
    });
  }
}
