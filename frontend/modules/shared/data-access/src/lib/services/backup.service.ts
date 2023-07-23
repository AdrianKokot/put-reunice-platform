import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Backup } from "../models/backup";

@Injectable({
  providedIn: "root"
})
export class BackupService {
  private backupUrl = `/api/backups`;

  constructor(
    private http: HttpClient
  ) {
  }

  getBackups(): Observable<Backup[]> {
    return this.http
      .get<Backup[]>(this.backupUrl);
  }

  downloadBackup(
    backupName: string,

  ): Observable<Blob> {
    return this.http
      .get(`${this.backupUrl}/download/${backupName}`, {
        reportProgress: true,
        responseType: "blob"
      });
  }

  createBackup(): Observable<void> {
    return this.http
      .post<void>(this.backupUrl + "/export", null);
  }

  deleteBackup(
    backupName: string,

  ): Observable<void> {
    return this.http
      .delete<void>(`${this.backupUrl}/delete/${backupName}`);
  }
}
