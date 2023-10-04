import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard/feature/dashboard-shell/dashboard-shell.component';
import { DashboardTilesComponent } from './dashboard/ui/dashboard-tiles/dashboard-tiles.component';
import { AuthorizedOfTypeGuard } from '@reunice/modules/shared/security';
import { ExtendedAccountTypeEnum } from '@reunice/modules/shared/data-access';
import { translatedTitle } from '@reunice/modules/shared/util';

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
        canMatch: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
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
        canMatch: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./keyword/keyword.module'),
      },
      {
        title: translatedTitle('BACKUPS'),
        path: 'backups',
        canMatch: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./backup/backup.module'),
      },
    ],
  },
];
