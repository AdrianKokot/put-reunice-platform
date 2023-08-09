import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private templateUrl = '/api/templates';

  constructor(private http: HttpClient) {}

  getTemplate(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.templateUrl}/${id}`);
  }

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.templateUrl + '/all');
  }

  getUniversityTemplates(universityID: number): Observable<Template[]> {
    return this.http.get<Template[]>(
      `${this.templateUrl}/?universityID=${universityID}`
    );
  }

  addTemplate(name: string): Observable<Template> {
    return this.http.post<Template>(this.templateUrl, name);
  }

  addUniversityToTemplate(
    templateID: number,
    universityID: number
  ): Observable<Template> {
    return this.http.post<Template>(
      `${this.templateUrl}/${templateID}/universities/${universityID}`,
      null
    );
  }

  removeUniversityFromTemplate(
    templateID: number,
    universityID: number
  ): Observable<Template> {
    return this.http.delete<Template>(
      `${this.templateUrl}/${templateID}/universities/${universityID}`
    );
  }

  modifyTemplateNameField(id: number, name: string): Observable<void> {
    return this.http.patch<void>(`${this.templateUrl}/${id}/name`, name);
  }

  modifyTemplateContentField(id: number, content: string): Observable<void> {
    return this.http.patch<void>(`${this.templateUrl}/${id}/content`, content);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.templateUrl}/${id}`);
  }
}
