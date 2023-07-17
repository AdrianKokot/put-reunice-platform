import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Page, PageForm, PageUpdateForm } from 'src/assets/models/page';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private pageUrl = `${environment.backendAPIRootUrl}/pages`;

  sidenavToggled = new EventEmitter();

  httpOptions = {
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getPage(id: number, defaultErrorHandling = true): Observable<Page> {
    return this.http
      .get<Page>(`${this.pageUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getPages(defaultErrorHandling = true): Observable<Page[]> {
    return this.http
      .get<Page[]>(`${this.pageUrl}?sort=id`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getMainPages(defaultErrorHandling = true): Observable<Page[]> {
    return this.http
      .get<Page[]>(this.pageUrl + '/main?sort=title', this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getNewPages(defaultErrorHandling = true): Observable<Page[]> {
    return this.http
      .get<Page[]>(`${this.pageUrl}?sort=createdOn,desc`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  searchPages(text: string, defaultErrorHandling = true): Observable<Page[]> {
    return this.http
      .get<Page[]>(`${this.pageUrl}/search/${text}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyPageContentField(
    id: number,
    content: string,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.pageUrl}/${id}/content`, content, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  modifyPageHiddenField(
    id: number,
    hidden: boolean,
    defaultErrorHandling = true
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.pageUrl}/${id}/hidden`, hidden, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  deletePage(id: number, defaultErrorHandling = true): Observable<any> {
    return this.http
      .delete<Page>(`${this.pageUrl}/${id}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  addNewPage(Page: PageForm, defaultErrorHandling = true): Observable<Page> {
    return this.http
      .post<Page>(this.pageUrl, Page, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getCreatorPages(
    userId: number,
    defaultErrorHandling = true
  ): Observable<Page[]> {
    return this.http
      .get<Page[]>(`${this.pageUrl}/creator/${userId}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  editPage(
    pageId: number,
    Page: PageUpdateForm,
    defaultErrorHandling = true
  ): Observable<Page> {
    return this.http
      .put<Page>(`${this.pageUrl}/${pageId}`, Page, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  changePageCreator(
    id: number,
    username: string,
    defaultErrorHandling = true
  ): Observable<Page> {
    return this.http
      .patch<Page>(`${this.pageUrl}/${id}/creator`, username, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  changeKeyWords(
    id: number,
    keyWords: string,
    defaultErrorHandling = true
  ): Observable<Page> {
    return this.http
      .patch<Page>(`${this.pageUrl}/${id}/keyWords`, keyWords, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }

  getUniversityHierarchy(
    universityId: number,
    defaultErrorHandling = true
  ): Observable<Page> {
    return this.http
      .get<Page>(`${this.pageUrl}/hierarchy/${universityId}`, this.httpOptions)
      .pipe(this.errorHandler.getErrorHandling(defaultErrorHandling));
  }
}
