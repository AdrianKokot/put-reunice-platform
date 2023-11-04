import { BaseResource } from '../models/base-resource';
import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { Page, PageForm } from '../models/page';
import { combineLatest, delay, Observable, of, switchMap } from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { FileResource } from '../models/file';
import { User } from '../models/user';

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

  override update(
    resource: (Partial<Omit<Page, 'contactRequestHandlers'>> &
      Pick<Page, 'id'>) &
      Partial<{
        files: TuiFileLike[];
        filesToRemove: Array<FileResource['id']>;
        contactRequestHandlers: Array<User['id']>;
      }>,
  ): Observable<Page> {
    const formData = new FormData();

    resource?.files?.forEach((file) => {
      formData.append('files', file as File, file.name);
    });

    formData.append('pageId', resource.id.toString());

    return combineLatest([
      this._http.put<Page>(`${this._resourceUrl}/${resource.id}`, resource),
      (resource.files ?? []).length > 0
        ? this._http.post<void>('/api/files/upload', formData)
        : of(null),
      (resource.filesToRemove ?? []).length > 0
        ? this._http.post<void>(
            '/api/files/delete',
            resource.filesToRemove ?? [],
          )
        : of(null),
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  getUniversityHierarchy(universityId: BaseResource['id']): Observable<Page> {
    return this._http.get<Page>(
      `${this._resourceUrl}/hierarchy/${universityId}`,
    );
  }

  sendQuestion(
    pageId: BaseResource['id'],
    form: { name: string; content: string; email: string },
  ) {
    console.log({ pageId, form });
    return of(true).pipe(delay(1000));
  }
}
