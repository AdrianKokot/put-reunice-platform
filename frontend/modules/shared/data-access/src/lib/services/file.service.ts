import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { FileResource, FileResourceForm } from '../models/file';
import { AbstractApiService } from './abstract-api.service';
import { BaseResource } from '../models/base-resource';

@Injectable({
  providedIn: 'root',
})
export class FileService extends AbstractApiService<
  FileResource,
  FileResourceForm,
  FileResourceForm
> {
  constructor() {
    super('/api/files');
  }

  override create(resource: FileResourceForm): Observable<FileResource> {
    return this._http.post<FileResource>(
      this._resourceUrl,
      this._getFormData(resource),
    );
  }

  override update(
    resource: FileResourceForm & Pick<FileResource, 'id'>,
  ): Observable<FileResource> {
    return this._http
      .put<FileResource>(
        `${this._resourceUrl}/${resource.id}`,
        this._getFormData(resource),
      )
      .pipe(switchMap(() => this.get(resource.id)));
  }

  private _getFormData(resource: FileResourceForm): FormData {
    const formData = new FormData();

    if (resource.file) {
      formData.append('file', resource.file as File, resource.file.name);
    } else {
      formData.append('url', resource.url as string);
    }

    formData.append('authorId', resource.authorId.toString());
    formData.append('description', resource.description);
    formData.append('name', resource.name);

    return formData;
  }

  getByPage(pageID: BaseResource['id']): Observable<FileResource[]> {
    return this._http.get<FileResource[]>(
      `${this._resourceUrl}/page/${pageID}`,
    );
  }
}
