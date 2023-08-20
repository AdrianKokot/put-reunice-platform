import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './feature/user-list/user-list.component';
import { UserEditFormComponent } from './feature/user-edit-form/user-edit-form.component';
import { UserCreateFormComponent } from './feature/user-create-form/user-create-form.component';
import { UserDetailsComponent } from './feature/user-details/user-details.component';

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
    title: 'User details',
    path: ':id',
    children: [
      {
        title: 'User details',
        path: '',
        component: UserDetailsComponent,
      },
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
