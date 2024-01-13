import { Injectable } from '@angular/core';
import { AbstractApiService } from './abstract-api.service';
import { GlobalPage, PageForm } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class GlobalPageService extends AbstractApiService<
  GlobalPage,
  GlobalPage,
  PageForm
> {
  constructor() {
    super('/api/global-pages');
  }
}
