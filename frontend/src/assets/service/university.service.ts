import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { University, UniversityForm } from '../models/university';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private universityUrl = `${environment.backendAPIRootUrl}/universities`;

  httpOptions = {
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getUniversity(
    id: number,
    defaultErrorHandling = true
  ): Observable<University> {
    return this.http
      .get<University>(`${this.universityUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getUniversities(defaultErrorHandling = true): Observable<University[]> {
    return this.http
      .get<University[]>(this.universityUrl, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  searchUniversities(
    text: string,
    defaultErrorHandling = true
  ): Observable<University[]> {
    return this.http
      .get<University[]>(
        `${this.universityUrl}/search/${text}`,
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  addNewUniversity(
    University: UniversityForm,
    defaultErrorHandling = true
  ): Observable<University> {
    return this.http
      .post<University>(this.universityUrl, University, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyUniversityHiddenField(
    id: number,
    hidden: boolean,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(
        `${this.universityUrl}/${id}/hidden`,
        hidden,
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  deleteUniversity(id: number, defaultErrorHandling = true): Observable<void> {
    return this.http
      .delete<void>(`${this.universityUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  editUniversity(
    University: UniversityForm,
    defaultErrorHandling = true
  ): Observable<University> {
    return this.http
      .put<University>(
        `${this.universityUrl}/${University.id}`,
        University,
        this.httpOptions
      )
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }
}
