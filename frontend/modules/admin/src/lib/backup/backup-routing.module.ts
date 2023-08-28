import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    title: 'Backups',
    path: '',
    loadComponent: () =>
      import('./feature/backup-list/backup-list.component').then(
        (m) => m.BackupListComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackupRoutingModule {}
