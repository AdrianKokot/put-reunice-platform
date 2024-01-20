import { BaseResource } from '../models/base-resource';
import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Page, PageUpdateForm } from '../models/page';
import { Observable } from 'rxjs';

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
}
