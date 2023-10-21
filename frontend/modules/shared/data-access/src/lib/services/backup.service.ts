import { Injectable } from '@angular/core';
import { Backup } from '../models/backup';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class BackupService extends AbstractApiService<Backup> {
  constructor() {
    super('/api/backups');
  }

  // downloadBackup(backupName: string): Observable<Blob> {
  //   return this.http.get(`${this.backupUrl}/download/${backupName}`, {
  //     reportProgress: true,
  //     responseType: 'blob',
  //   });
  // }
  //

  // createBackup(): Observable<void> {
  //   return this.http.post<void>(this.backupUrl + '/export', null);
  // }
  //
  // deleteBackup(backupName: string): Observable<void> {
  //   return this.http.delete<void>(`${this.backupUrl}/delete/${backupName}`);
  // }
}
