import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Template, TemplateCreate } from '../models/template';
import { AbstractApiService, TOTAL_ITEMS_HEADER } from './abstract-api.service';
import { University } from '../models/university';
import { ApiPaginatedResponse } from '../api.params';

@Injectable({
  providedIn: 'root',
})
export class TemplateService extends AbstractApiService<
  Template,
  TemplateCreate,
  TemplateCreate
> {
  constructor() {
    super('/api/templates');
  }

  override getAll() {
    return this._http
      .get<Template[]>(this._resourceUrl + '/all', {
        observe: 'response',
      })
      .pipe(
        map(
          ({ body, headers }): ApiPaginatedResponse<Template> => ({
            totalItems: Number(headers.get(TOTAL_ITEMS_HEADER)),
            items: body ?? [],
          })
        )
      );
  }

  override update(
    resource: Partial<TemplateCreate> & Pick<Template, 'id'>
  ): Observable<Template> {
    return combineLatest([
      this._http.patch<Template>(
        `${this._resourceUrl}/${resource.id}/content`,
        resource.content
      ),
      this._http.patch<Template>(
        `${this._resourceUrl}/${resource.id}/name`,
        resource.name
      ),
      ...(resource.universities?.map((id) =>
        this._http.post<void>(
          `${this._resourceUrl}/${resource.id}/universities/${id}`,
          ''
        )
      ) ?? []),
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  override create(resource: Partial<TemplateCreate>): Observable<Template> {
    return this._http
      .post<Template>(`${this._resourceUrl}`, resource.name)
      .pipe(
        switchMap((template) => this.update({ id: template.id, ...resource }))
      );
  }

  getTemplatesForUniversity(
    universityId: University['id']
  ): Observable<Template[]> {
    return this._http.get<Template[]>(
      `${this._resourceUrl}?universityID=${universityId}`
    );
  }
}
