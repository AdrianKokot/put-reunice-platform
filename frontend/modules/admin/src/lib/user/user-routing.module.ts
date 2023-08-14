import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './feature/user-list/user-list.component';
import { UserEditFormComponent } from './feature/user-edit-form/user-edit-form.component';
import { UserCreateFormComponent } from './feature/user-create-form/user-create-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    title: 'Create User',
    path: 'new',
    component: UserCreateFormComponent,
  },
  {
    path: ':id',
    children: [
      {
        title: 'Edit user',
        path: 'edit',
        component: UserEditFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
