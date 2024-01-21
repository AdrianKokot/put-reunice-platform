import { BaseResource } from '../models/base-resource';
import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Page, PageUpdateForm } from '../models/page';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService extends AbstractApiService<
  Page,
  Page,
  PageUpdateForm
> {
  constructor() {
    super('/api/pages');
  }

  getMainPages(): Observable<Page[]> {
    return this._http.get<Page[]>(`${this._resourceUrl}/main?sort=title`);
  }

  getUniversityHierarchy(universityId: BaseResource['id']): Observable<Page> {
    return this._http.get<Page>(
      `${this._resourceUrl}/hierarchy/${universityId}`,
    );
  }

  deleteWithResources(id: BaseResource['id']): Observable<boolean> {
    return this._http
      .delete(`${this._resourceUrl}/${id}?with_resources=true`, {
        observe: 'response',
      })
      .pipe(map(({ status }) => status >= 200 && status < 300));
  }
}
