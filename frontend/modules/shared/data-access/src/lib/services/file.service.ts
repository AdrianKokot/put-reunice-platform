import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileResource } from '../models/file';
import { BaseResource } from '../models/base-resource';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly server = '/api/file';

  constructor(private readonly http: HttpClient) {}

  getAll(pageID: BaseResource['id']): Observable<FileResource[]> {
    return this.http.get<FileResource[]>(`${this.server}/page/${pageID}`);
  }

  deleteFile(filename: string, pageID: number): Observable<FileResource[]> {
    return this.http.delete<FileResource[]>(
      `${this.server}/delete/page/${pageID}/${filename}`,
    );
  }

  upload(
    formData: FormData,
    pageId: number,
    userId: number,
  ): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(
      `${this.server}/upload/page/${pageId}/user/${userId}`,
      formData,
      {
        withCredentials: true,
        reportProgress: true,
        observe: 'events',
      },
    );
  }

  download(fileId: FileResource['id']): Observable<Blob> {
    return this.http.get(`${this.server}/${fileId}/download`, {
      // reportProgress: true,
      withCredentials: true,
      // observe: 'events',
      responseType: 'blob',
    });
  }
}
