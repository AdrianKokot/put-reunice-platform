import { Injectable } from '@angular/core';
import { University } from '../models/university';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class UniversityService extends AbstractApiService<University> {
  constructor() {
    super('/api/universities');
  }

  public uploadFile(id: University['id'], file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post<University>(
      `${this._resourceUrl}/${id}/image`,
      formData,
    );
  }
}
