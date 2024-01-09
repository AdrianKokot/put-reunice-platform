import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { translatedTitle } from '@reunice/modules/shared/util';
import { map } from 'rxjs';
import { PageDetailsComponent } from './feature/page-details/page-details.component';
import { UniversityListComponent } from './feature/university-list/university-list.component';
import { UniversityShellComponent } from './feature/university-shell/university-shell.component';

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
        router.createUrlTree(['universities', u.id, 'page', u.mainPage.id]),
      ),
    );
};

const routes: Routes = [
  {
    path: '',
    component: UniversityListComponent,
    title: translatedTitle('UNIVERSITIES'),
  },
  {
    path: ':id',
    component: UniversityShellComponent,
    title: translatedTitle('UNIVERSITY_DETAILS'),
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
