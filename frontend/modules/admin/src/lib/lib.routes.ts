import { Route } from '@angular/router';
import { DashboardShellComponent } from './dashboard/feature/dashboard-shell/dashboard-shell.component';
import { DashboardTilesComponent } from './dashboard/ui/dashboard-tiles/dashboard-tiles.component';

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
        path: 'universities',
        loadChildren: () => import('./university/university.module'),
      },
      {
        path: 'pages',
        loadChildren: () => import('./page/page.module'),
      },
      {
        path: 'templates',
        loadChildren: () => import('./template/template.module'),
      },
      {
        path: 'users',
        loadChildren: () => import('./user/user.module'),
      },
      {
        path: 'keywords',
        loadChildren: () => import('./keyword/keyword.module'),
      },
      {
        path: 'backups',
        loadChildren: () => import('./backup/backup.module'),
      },
    ],
  },
];
