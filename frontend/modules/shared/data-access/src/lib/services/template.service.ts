import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template, TemplateCreate } from '../models/template';
import { AbstractApiService } from './abstract-api.service';
import { University } from '../models/university';

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

  getTemplatesForUniversity(
    universityId: University['id'],
  ): Observable<Template[]> {
    return this._http.get<Template[]>(
      `${this._resourceUrl}?university=${universityId}`,
    );
  }
}
