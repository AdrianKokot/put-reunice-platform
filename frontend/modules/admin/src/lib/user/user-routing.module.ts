import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './feature/user-list/user-list.component';
import { UserEditFormComponent } from './feature/user-edit-form/user-edit-form.component';
import { UserCreateFormComponent } from './feature/user-create-form/user-create-form.component';
import { UserDetailsComponent } from './feature/user-details/user-details.component';
import { translatedTitle } from '@eunice/modules/shared/util';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    title: translatedTitle('NEW_USER'),
    path: 'new',
    component: UserCreateFormComponent,
  },
  {
    title: translatedTitle('USER_DETAILS'),
    path: ':id',
    children: [
      {
        title: translatedTitle('USER_DETAILS'),
        path: '',
        component: UserDetailsComponent,
      },
      {
        title: translatedTitle('EDIT_USER'),
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
