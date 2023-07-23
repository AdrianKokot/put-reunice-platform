import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Keyword } from '../models/keyword';

@Injectable({
  providedIn: 'root',
})
export class KeyWordsService {
  private keyWordsUrl = `/api/keyWords`;

  constructor(private http: HttpClient) {}

  getKeyWord(id: number): Observable<Keyword> {
    return this.http.get<Keyword>(`${this.keyWordsUrl}/${id}`);
  }

  getAllKeyWords(): Observable<Keyword[]> {
    return this.http.get<Keyword[]>(this.keyWordsUrl + '/all');
  }

  addKeyWord(word: string): Observable<string> {
    return this.http.post<string>(this.keyWordsUrl, word);
  }

  modifyKeyWordWordField(id: number, word: string): Observable<void> {
    return this.http.post<void>(`${this.keyWordsUrl}/${id}`, word);
  }

  deleteKeyWord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.keyWordsUrl}/${id}`);
  }
}
