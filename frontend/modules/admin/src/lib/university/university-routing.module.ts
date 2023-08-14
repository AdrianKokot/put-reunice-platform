import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversityListComponent } from './feature/university-list/university-list.component';
import { UniversityEditFormComponent } from './feature/university-edit-form/university-edit-form.component';
import { UniversityCreateFormComponent } from './feature/university-create-form/university-create-form.component';

const routes: Routes = [
  {
    path: '',
    component: UniversityListComponent,
  },
  {
    title: 'Create University',
    path: 'new',
    component: UniversityCreateFormComponent,
  },
  {
    title: 'University details',
    path: ':id',
    children: [
      {
        resolve: {
          readOnly: () => true,
        },
        title: 'University details',
        path: '',
        component: UniversityEditFormComponent,
      },
      {
        title: 'Edit university',
        path: 'edit',
        component: UniversityEditFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniversityRoutingModule {}
