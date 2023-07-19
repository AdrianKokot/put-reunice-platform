import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Keyword } from '../models/keywords';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KeyWordsService {
  private keyWordsUrl = `${environment.backendAPIRootUrl}/keyWords`;

  httpOptions = {
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getKeyWord(id: number, defaultErrorHandling = true): Observable<Keyword> {
    return this.http
      .get<Keyword>(`${this.keyWordsUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getAllKeyWords(defaultErrorHandling = true): Observable<Keyword[]> {
    return this.http
      .get<Keyword[]>(this.keyWordsUrl + '/all', this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  addKeyWord(word: string, defaultErrorHandling = true): Observable<string> {
    return this.http
      .post<string>(this.keyWordsUrl, word, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyKeyWordWordField(
    id: number,
    word: string,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .post<void>(`${this.keyWordsUrl}/${id}`, word, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  deleteKeyWord(id: number, defaultErrorHandling = true): Observable<any> {
    return this.http
      .delete<void>(`${this.keyWordsUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }
}
