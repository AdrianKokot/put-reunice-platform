import { Injectable } from '@angular/core';
import { combineLatest, Observable, switchMap } from 'rxjs';
import { Page, PageForm } from '../models/page';
import { AbstractApiService } from './abstract-api.service';
import { University } from '../models/university';
import { TuiFileLike } from '@taiga-ui/kit';

@Injectable({
  providedIn: 'root',
})
export class PageService extends AbstractApiService<Page, Page, PageForm> {
  constructor() {
    super('/api/pages');
  }

  getMainPages(): Observable<Page[]> {
    return this._http.get<Page[]>(this._resourceUrl + '/main?sort=title');
  }

  override create(resource: PageForm & Partial<Page>): Observable<Page> {
    return this._http
      .post<Page>(this._resourceUrl, resource)
      .pipe(
        switchMap((page) =>
          combineLatest([
            this._http.patch<Page>(
              `${this._resourceUrl}/${page.id}/content`,
              resource.content,
            ),
            this._http.patch<Page>(
              `${this._resourceUrl}/${page.id}/hidden`,
              resource.hidden,
            ),
          ]).pipe(switchMap(() => this.get(page.id))),
        ),
      );
  }

  override update(
    resource: (Partial<Page> & Pick<Page, 'id'>) &
      Partial<{ files: TuiFileLike[] }>,
  ): Observable<Page> {
    const formData = new FormData();

    console.log({ resource });
    resource?.files?.forEach((file) => {
      formData.append('files', file as File, file.name);
    });

    formData.append('pageId', resource.id.toString());
    console.log({ formData });

    return combineLatest([
      this._http.patch<Page>(
        `${this._resourceUrl}/${resource.id}/content`,
        resource.content,
      ),
      this._http.patch<Page>(
        `${this._resourceUrl}/${resource.id}/hidden`,
        resource.hidden,
      ),
      this._http.put<Page>(`${this._resourceUrl}/${resource.id}`, resource),
      this._http.post<void>('/api/file/upload', formData),
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  getUniversityHierarchy(universityId: University['id']): Observable<Page> {
    return this._http.get<Page>(
      `${this._resourceUrl}/hierarchy/${universityId}`,
    );
  }
}
