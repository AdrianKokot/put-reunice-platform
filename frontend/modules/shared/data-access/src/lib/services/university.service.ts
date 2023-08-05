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
}
