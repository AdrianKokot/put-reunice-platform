import { Route } from '@angular/router';

export const adminRoutes: Route[] = [
  {
    path: 'universities',
    loadChildren: () => import('./university/university.module'),
  },
];
