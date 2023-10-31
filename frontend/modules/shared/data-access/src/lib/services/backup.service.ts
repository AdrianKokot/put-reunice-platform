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
}
