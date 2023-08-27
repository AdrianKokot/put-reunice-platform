import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileFormComponent } from './feature/profile-form/profile-form.component';
import { ProfileChangePasswordComponent } from './feature/profile-change-password/profile-change-password.component';
import { ProfileShellComponent } from './feature/profile-shell/profile-shell.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
      {
        path: 'details',
        component: ProfileFormComponent,
      },
      {
        path: 'change-password',
        component: ProfileChangePasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileModule {}
