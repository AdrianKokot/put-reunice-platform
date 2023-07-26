import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
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
];
