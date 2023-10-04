import { Injectable } from '@angular/core';
import { Template, TemplateCreate } from '../models/template';
import { AbstractApiService } from './abstract-api.service';

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
}
