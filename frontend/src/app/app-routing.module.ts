import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedGuard } from '@reunice/modules/shared/security';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@reunice/modules/admin').then((m) => m.AdminModule),
    canMatch: [AuthorizedGuard],
  },
  { path: '', redirectTo: 'universities', pathMatch: 'full' },
  {
    path: 'universities',
    loadChildren: () =>
      import('./university/university.module').then((m) => m.UniversityModule),
  },
  {
    loadChildren: () =>
      import('@reunice/modules/auth').then((m) => m.AuthModule),
    path: 'auth',
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
