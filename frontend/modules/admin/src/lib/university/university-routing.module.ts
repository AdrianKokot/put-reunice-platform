import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversityListComponent } from './feature/university-list/university-list.component';
import { UniversityEditFormComponent } from './feature/university-edit-form/university-edit-form.component';
import { UniversityCreateFormComponent } from './feature/university-create-form/university-create-form.component';
import { UniversityDetailsComponent } from './feature/university-details/university-details.component';
import {
  DeactivateFormGuard,
  translatedTitle,
} from '@reunice/modules/shared/util';

const routes: Routes = [
  {
    path: '',
    component: UniversityListComponent,
  },
  {
    title: translatedTitle('NEW_UNIVERSITY'),
    path: 'new',
    component: UniversityCreateFormComponent,
    canDeactivate: [DeactivateFormGuard('form')],
  },
  {
    title: translatedTitle('UNIVERSITY_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('UNIVERSITY_DETAILS'),
        path: '',
        component: UniversityDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_UNIVERSITY'),
        path: 'edit',
        component: UniversityEditFormComponent,
        canDeactivate: [DeactivateFormGuard('form')],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniversityRoutingModule {}
