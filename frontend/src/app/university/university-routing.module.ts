import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversityListComponent } from './feature/university-list/university-list.component';
import { UniversityShellComponent } from './feature/university-shell/university-shell.component';
import { PageDetailsComponent } from './feature/page-details/page-details.component';

const routes: Routes = [
  {
    path: '',
    component: UniversityListComponent,
    title: 'Uniwersytety',
  },
  {
    path: ':id',
    component: UniversityShellComponent,
    title: 'Szczegóły uniwersytetu',
    children: [
      {
        path: 'page/:pageId',
        component: PageDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniversityRoutingModule {}
