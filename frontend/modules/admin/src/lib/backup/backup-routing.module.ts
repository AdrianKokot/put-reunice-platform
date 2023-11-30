import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackupListComponent } from './feature/backup-list/backup-list.component';

const routes: Routes = [
  {
    path: '',
    component: BackupListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackupRoutingModule {}
