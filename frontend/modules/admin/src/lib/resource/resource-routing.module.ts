import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourceListComponent } from './feature/resource-list/resource-list.component';
import { ResourceEditFormComponent } from './feature/resource-edit-form/resource-edit-form.component';
import { ResourceCreateFormComponent } from './feature/resource-create-form/resource-create-form.component';
import { ResourceDetailsComponent } from './feature/resource-details/resource-details.component';
import {
  DeactivateFormGuard,
  translatedTitle,
} from '@reunice/modules/shared/util';

const routes: Routes = [
  {
    path: '',
    component: ResourceListComponent,
  },
  {
    title: translatedTitle('NEW_RESOURCE'),
    path: 'new',
    component: ResourceCreateFormComponent,
    canDeactivate: [DeactivateFormGuard('form')],
  },
  {
    title: translatedTitle('RESOURCE_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('RESOURCE_DETAILS'),
        path: '',
        component: ResourceDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_RESOURCE'),
        path: 'edit',
        component: ResourceEditFormComponent,
        canDeactivate: [DeactivateFormGuard('form')],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRoutingModule {}
