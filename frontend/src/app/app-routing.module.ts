import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reunice/modules/shared/security';
import { AuthModule } from '@reunice/modules/auth';
import { UniversityModule } from './university/university.module';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@reunice/modules/admin').then((m) => m.AdminModule),
    canMatch: [AuthGuard],
  },
  { path: '', redirectTo: 'universities', pathMatch: 'full' },
  {
    path: 'universities',
    loadChildren: () => UniversityModule,
  },
  {
    loadChildren: () => AuthModule,
    path: 'auth',
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canMatch: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
