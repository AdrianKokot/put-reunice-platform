import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackupService } from '@reunice/modules/shared/data-access';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiFormatDatePipeModule, TuiLinkModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-backup-list',
  templateUrl: './backup-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiFormatDatePipeModule,
    RouterLink,
    TuiLinkModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupListComponent {
  private readonly _backupService = inject(BackupService);

  readonly columns = ['id', 'date', 'size', 'actions'];

  readonly backups$ = this._backupService.getBackups();
}
