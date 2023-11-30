import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageEditFormComponent } from './feature/page-edit-form/page-edit-form.component';
import { PageListComponent } from './feature/page-list/page-list.component';
import { PageCreateFormComponent } from './feature/page-create-form/page-create-form.component';
import { PageDetailsComponent } from './feature/page-details/page-details.component';
import { translatedTitle } from '@reunice/modules/shared/util';

const routes: Routes = [
  {
    path: '',
    component: PageListComponent,
  },
  {
    title: translatedTitle('NEW_PAGE'),
    path: 'new',
    component: PageCreateFormComponent,
  },
  {
    title: translatedTitle('PAGE_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('PAGE_DETAILS'),
        path: '',
        component: PageDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_PAGE'),
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
