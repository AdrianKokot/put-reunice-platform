import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@reunice/modules/admin').then((m) => m.AdminModule),
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
