import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageEditFormComponent } from './feature/page-edit-form/page-edit-form.component';
import { PageListComponent } from './feature/page-list/page-list.component';
import { PageCreateFormComponent } from './feature/page-create-form/page-create-form.component';
import { PageDetailsComponent } from './feature/page-details/page-details.component';

const routes: Routes = [
  {
    path: '',
    component: PageListComponent,
  },
  {
    path: 'new',
    component: PageCreateFormComponent,
  },
  {
    title: 'Page details',
    path: ':id',
    children: [
      {
        title: 'Page details',
        path: '',
        component: PageDetailsComponent,
      },
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
