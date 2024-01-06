import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorShellComponent } from './feature/author-shell/author-shell.component';

const routes: Routes = [
  {
    path: ':id',
    component: AuthorShellComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorRoutingModule {}
