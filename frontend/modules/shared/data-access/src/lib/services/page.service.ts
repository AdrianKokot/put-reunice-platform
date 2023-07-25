import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page, PageForm, PageUpdateForm } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private pageUrl = `/api/pages`;

  sidenavToggled = new EventEmitter();

  constructor(private http: HttpClient) {}

  getPage(id: number): Observable<Page> {
    return this.http.get<Page>(`${this.pageUrl}/${id}`);
  }

  getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.pageUrl}?sort=id`);
  }

  getMainPages(): Observable<Page[]> {
    return this.http.get<Page[]>(this.pageUrl + '/main?sort=title');
  }

  getNewPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.pageUrl}?sort=createdOn,desc`);
  }

  searchPages(text: string): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.pageUrl}/search/${text}`);
  }

  modifyPageContentField(id: number, content: string): Observable<void> {
    return this.http.patch<void>(`${this.pageUrl}/${id}/content`, content);
  }

  modifyPageHiddenField(id: number, hidden: boolean): Observable<void> {
    return this.http.patch<void>(`${this.pageUrl}/${id}/hidden`, hidden);
  }

  deletePage(id: number): Observable<unknown> {
    return this.http.delete<Page>(`${this.pageUrl}/${id}`);
  }

  addNewPage(Page: PageForm): Observable<Page> {
    return this.http.post<Page>(this.pageUrl, Page);
  }

  getCreatorPages(userId: number): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.pageUrl}/creator/${userId}`);
  }

  editPage(pageId: number, Page: PageUpdateForm): Observable<Page> {
    return this.http.put<Page>(`${this.pageUrl}/${pageId}`, Page);
  }

  changePageCreator(id: number, username: string): Observable<Page> {
    return this.http.patch<Page>(`${this.pageUrl}/${id}/creator`, username);
  }

  changeKeyWords(id: number, keyWords: string): Observable<Page> {
    return this.http.patch<Page>(`${this.pageUrl}/${id}/keyWords`, keyWords);
  }

  getUniversityHierarchy(universityId: number): Observable<Page> {
    return this.http.get<Page>(`${this.pageUrl}/hierarchy/${universityId}`);
  }
}
