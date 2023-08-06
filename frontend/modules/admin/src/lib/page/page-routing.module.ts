import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageEditFormComponent } from './feature/page-edit-form/page-edit-form.component';
import { PageListComponent } from './feature/page-list/page-list.component';

const routes: Routes = [
  {
    path: '',
    component: PageListComponent,
  },
  {
    path: ':id',
    children: [
      {
        title: 'Edit page',
        path: 'edit',
        component: PageEditFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
