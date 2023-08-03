import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { UniversityListComponent } from './feature/university-list/university-list.component';
import { UniversityEditFormComponent } from './feature/university-edit-form/university-edit-form.component';
import { of, startWith } from 'rxjs';
import { UniversityService } from '@reunice/modules/shared/data-access';

const routes: Routes = [
  {
    path: '',
    component: UniversityListComponent,
  },
  {
    title: 'University details',
    path: ':id',
    resolve: {
      university$: (route: ActivatedRouteSnapshot) =>
        of(
          inject(UniversityService)
            .get(parseInt(route.params['id']))
            .pipe(startWith(null))
        ),
    },
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
