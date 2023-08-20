import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { UniversityListComponent } from './feature/university-list/university-list.component';
import { UniversityShellComponent } from './feature/university-shell/university-shell.component';
import { PageDetailsComponent } from './feature/page-details/page-details.component';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { map } from 'rxjs';

export const RedirectToUniversityMainPage: CanActivateFn = (route) => {
  const id = route.paramMap.get('id');
  const router = inject(Router);

  if (id === null) {
    return router.createUrlTree(['/']);
  }

  const service = inject(UniversityService);

  return service
    .get(id)
    .pipe(
      map((u) =>
        router.createUrlTree(['universities', u.id, 'page', u.mainPage.id])
      )
    );
};

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
      {
        path: '',
        canActivate: [RedirectToUniversityMainPage],
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
