import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeywordListComponent } from './feature/keyword-list/keyword-list.component';
import { KeywordEditFormComponent } from './feature/keyword-edit-form/keyword-edit-form.component';
import { KeywordCreateFormComponent } from './feature/keyword-create-form/keyword-create-form.component';
import { KeywordDetailsComponent } from './feature/keyword-details/keyword-details.component';

const routes: Routes = [
  {
    path: '',
    component: KeywordListComponent,
  },
  {
    path: 'new',
    title: 'New keyword',
    component: KeywordCreateFormComponent,
  },
  {
    title: 'Keyword details',
    path: ':id',
    children: [
      {
        path: '',
        component: KeywordDetailsComponent,
      },
      {
        title: 'Edit keyword',
        path: 'edit',
        component: KeywordEditFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeywordRoutingModule {}
