import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard/feature/dashboard-shell/dashboard-shell.component';
import { DashboardTilesComponent } from './dashboard/ui/dashboard-tiles/dashboard-tiles.component';
import { AuthorizedOfTypeGuard } from '@reunice/modules/shared/security';
import { ExtendedAccountTypeEnum } from '@reunice/modules/shared/data-access';

export const adminRoutes: Route[] = [
  {
    path: '',
    title: 'Dashboard',
    component: DashboardShellComponent,
    children: [
      {
        path: '',
        component: DashboardTilesComponent,
      },
      {
        title: 'Universities',
        path: 'universities',
        canMatch: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./university/university.module'),
      },
      {
        title: 'Pages',
        path: 'pages',
        loadChildren: () => import('./page/page.module'),
      },
      {
        title: 'Templates',
        path: 'templates',
        loadChildren: () => import('./template/template.module'),
      },
      {
        title: 'Users',
        path: 'users',
        loadChildren: () => import('./user/user.module'),
      },
      {
        title: 'Keywords',
        path: 'keywords',
        canMatch: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./keyword/keyword.module'),
      },
      {
        title: 'Backups',
        path: 'backups',
        canMatch: [AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.ADMIN)],
        loadChildren: () => import('./backup/backup.module'),
      },
    ],
  },
];
