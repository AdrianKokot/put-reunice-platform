import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResource } from '../models/file';
import { BaseResource } from '../models/base-resource';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class FileService extends AbstractApiService<FileResource> {
  constructor() {
    super('/api/files');
  }

  getByPage(pageID: BaseResource['id']): Observable<FileResource[]> {
    return this._http.get<FileResource[]>(
      `${this._resourceUrl}/page/${pageID}`,
    );
  }
}
