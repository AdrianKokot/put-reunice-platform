import { Injectable } from '@angular/core';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { Page } from '../models/page';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class PageService extends AbstractApiService<Page> {
  constructor() {
    super('/api/pages');
  }

  getMainPages(): Observable<Page[]> {
    return this._http.get<Page[]>(this._resourceUrl + '/main?sort=title');
  }

  override update(
    resource: Partial<Page> & Pick<Page, 'id'>
  ): Observable<Page> {
    return combineLatest([
      this._http.patch<Page>(
        `${this._resourceUrl}/${resource.id}/content`,
        resource.content
      ),
      this._http.patch<Page>(
        `${this._resourceUrl}/${resource.id}/hidden`,
        resource.hidden
      ),
      this._http.put<Page>(`${this._resourceUrl}/${resource.id}`, resource),
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  getUniversityHierarchy(universityId: number): Observable<Page> {
    return this._http.get<Page>(
      `${this._resourceUrl}/hierarchy/${universityId}`
    );
  }
}
