import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Template } from '../models/template';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class TemplateService extends AbstractApiService<Template> {
  constructor() {
    super('/api/templates');
  }

  override getAll(): Observable<Template[]> {
    return this._http.get<Template[]>(this._resourceUrl + '/all');
  }

  //
  // addUniversityToTemplate(
  //   templateID: number,
  //   universityID: number
  // ): Observable<Template> {
  //   return this.http.post<Template>(
  //     `${this.templateUrl}/${templateID}/universities/${universityID}`,
  //     null
  //   );
  // }
  //
  // removeUniversityFromTemplate(
  //   templateID: number,
  //   universityID: number
  // ): Observable<Template> {
  //   return this.http.delete<Template>(
  //     `${this.templateUrl}/${templateID}/universities/${universityID}`
  //   );
  // }

  override update(
    resource: Partial<Template> & Pick<Template, 'id'>
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
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  override create(resource: Partial<Template>): Observable<Template> {
    return this._http
      .post<Template>(`${this._resourceUrl}`, resource.name)
      .pipe(
        switchMap((template) =>
          this._http
            .patch<Template>(
              `${this._resourceUrl}/${template.id}/content`,
              resource.content
            )
            .pipe(map(() => template))
        ),
        switchMap((template) => this.get(template.id))
      );
  }
}
