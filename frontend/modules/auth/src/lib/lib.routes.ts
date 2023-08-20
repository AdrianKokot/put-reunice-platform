import { Route } from '@angular/router';
import { LoginShellComponent } from './features/login-shell/login-shell.component';
import { GuestGuard, logoutFn } from '@reunice/modules/shared/security';
import { Type } from '@angular/core';

export const authRoutes: Route[] = [
  { path: 'login', component: LoginShellComponent, canMatch: [GuestGuard] },
  {
    path: 'logout',
    canMatch: [logoutFn],
    component: {} as const as Type<unknown>,
  },
];
