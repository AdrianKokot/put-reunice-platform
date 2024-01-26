import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Resource, ResourceForm } from '../models/resource';
import { AbstractApiService } from './abstract-api.service';
import { BaseResource } from '../models/base-resource';

@Injectable({
  providedIn: 'root',
})
export class ResourceService extends AbstractApiService<
  Resource,
  ResourceForm,
  ResourceForm
> {
  constructor() {
    super('/api/resources');
  }

  override create(resource: ResourceForm): Observable<Resource> {
    return this._http.post<Resource>(
      this._resourceUrl,
      this._getFormData(resource),
    );
  }

  override update(
    resource: ResourceForm & Pick<Resource, 'id'>,
  ): Observable<Resource> {
    return this._http
      .put<Resource>(
        `${this._resourceUrl}/${resource.id}`,
        this._getFormData(resource),
      )
      .pipe(switchMap(() => this.get(resource.id)));
  }

  private _getFormData(resource: ResourceForm): FormData {
    const formData = new FormData();

    if (resource.file) {
      formData.append('file', resource.file as File, resource.file.name);
    } else if (resource.url && resource.url.trim().length > 0) {
      formData.append('url', resource.url);
    }

    formData.append('authorId', resource.authorId.toString());
    formData.append('description', resource.description);
    formData.append('name', resource.name);

    return formData;
  }

  getByPage(pageID: BaseResource['id']): Observable<Resource[]> {
    return this._http.get<Resource[]>(`${this._resourceUrl}/page/${pageID}`);
  }
}
