import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard/feature/dashboard-shell/dashboard-shell.component';
import { DashboardTilesComponent } from './dashboard/ui/dashboard-tiles/dashboard-tiles.component';
import { translatedTitle } from '@eunice/modules/shared/util';
import { ExtendedAccountTypeEnum } from '@eunice/modules/shared/data-access';
import { AuthorizedOfTypeGuard } from '@eunice/modules/shared/security';

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
        title: translatedTitle('GLOBAL_PAGES'),
        path: 'global-pages',
        loadChildren: () => import('./global-page/global-page.module'),
        canActivate: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
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
        title: translatedTitle('BACKUPS'),
        path: 'backups',
        canActivate: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./backup/backup.module'),
      },
      {
        title: translatedTitle('TICKETS'),
        path: 'tickets',
        loadChildren: () => import('./ticket/ticket.module'),
      },
      {
        title: translatedTitle('RESOURCES'),
        path: 'resources',
        loadChildren: () => import('./resource/resource.module'),
      },
    ],
  },
];
