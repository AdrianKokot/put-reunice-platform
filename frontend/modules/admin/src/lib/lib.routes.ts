import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard/feature/dashboard-shell/dashboard-shell.component';
import { DashboardTilesComponent } from './dashboard/ui/dashboard-tiles/dashboard-tiles.component';
import { translatedTitle } from '@reunice/modules/shared/util';
import { ExtendedAccountTypeEnum } from '@reunice/modules/shared/data-access';
import { AuthorizedOfTypeGuard } from '@reunice/modules/shared/security';

export const adminRoutes: Route[] = [
  {
    path: '',
    title: translatedTitle('DASHBOARD'),
    component: DashboardShellComponent,
    children: [
      {
        path: '',
        component: DashboardTilesComponent,
      },
      {
        title: translatedTitle('UNIVERSITIES'),
        path: 'universities',
        canActivate: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./university/university.module'),
      },
      {
        title: translatedTitle('PAGES'),
        path: 'pages',
        loadChildren: () => import('./page/page.module'),
      },
      {
        title: translatedTitle('TEMPLATES'),
        path: 'templates',
        loadChildren: () => import('./template/template.module'),
      },
      {
        title: translatedTitle('USERS'),
        path: 'users',
        loadChildren: () => import('./user/user.module'),
      },
      {
        title: translatedTitle('KEYWORDS'),
        path: 'keywords',
        canActivate: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./keyword/keyword.module'),
      },
      {
        title: translatedTitle('BACKUPS'),
        path: 'backups',
        canActivate: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./backup/backup.module'),
      },
    ],
  },
];
