import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalPageListComponent } from './feature/global-page-list/global-page-list.component';
import {
  DeactivateFormGuard,
  translatedTitle,
} from '@reunice/modules/shared/util';
import { GlobalPageCreateFormComponent } from './feature/global-page-create-form/global-page-create-form.component';
import { GlobalPageDetailsComponent } from './feature/global-page-details/global-page-details.component';
import { GlobalPageEditFormComponent } from './feature/global-page-edit-form/global-page-edit-form.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalPageListComponent,
  },
  {
    title: translatedTitle('NEW_PAGE'),
    path: 'new',
    component: GlobalPageCreateFormComponent,
    canDeactivate: [DeactivateFormGuard('form')],
  },
  {
    title: translatedTitle('PAGE_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('PAGE_DETAILS'),
        path: '',
        component: GlobalPageDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_PAGE'),
        path: 'edit',
        component: GlobalPageEditFormComponent,
        canDeactivate: [DeactivateFormGuard('form')],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalPageRoutingModule {}
