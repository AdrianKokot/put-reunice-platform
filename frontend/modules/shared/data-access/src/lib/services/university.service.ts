import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { University, UniversityForm } from '../models/university';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class UniversityService extends AbstractApiService<University> {
  private universityUrl = '/api/universities';

  constructor(private http: HttpClient) {
    super('/api/universities');
  }

  getUniversity(id: number): Observable<University> {
    return this.http.get<University>(`${this.universityUrl}/${id}`);
  }

  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(this.universityUrl);
  }

  searchUniversities(text: string): Observable<University[]> {
    return this.http.get<University[]>(`${this.universityUrl}/search/${text}`);
  }

  addNewUniversity(University: UniversityForm): Observable<University> {
    return this.http.post<University>(this.universityUrl, University);
  }

  modifyUniversityHiddenField(id: number, hidden: boolean): Observable<void> {
    return this.http.patch<void>(`${this.universityUrl}/${id}/hidden`, hidden);
  }

  deleteUniversity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.universityUrl}/${id}`);
  }

  editUniversity(University: UniversityForm): Observable<University> {
    return this.http.put<University>(
      `${this.universityUrl}/${University.id}`,
      University
    );
  }
}
