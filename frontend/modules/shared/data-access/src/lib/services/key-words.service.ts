import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Keyword } from '../models/keyword';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class KeyWordsService extends AbstractApiService<Keyword, string> {
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
}
