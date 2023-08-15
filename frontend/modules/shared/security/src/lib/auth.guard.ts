import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import {
  ExtendedAccountType,
  ExtendedAccountTypeEnum,
  User,
} from '@reunice/modules/shared/data-access';

export const isUserOfType = (
  user: User | null,
  accountType: ExtendedAccountType
): boolean => {
  if (accountType === ExtendedAccountTypeEnum.GUEST) {
    return user === null;
  }

  if (accountType === ExtendedAccountTypeEnum.AUTHORIZED) {
    return user !== null;
  }

  if (accountType === ExtendedAccountTypeEnum.ADMINISTRATIVE) {
    return (
      user?.accountType === ExtendedAccountTypeEnum.ADMIN ||
      user?.accountType === ExtendedAccountTypeEnum.MODERATOR
    );
  }

  return user?.accountType === accountType;
};

export const AuthorizedOfTypeGuard = (
  accountType: ExtendedAccountType,
  redirectCommands: Parameters<Router['createUrlTree']>[0] = ['/']
): CanMatchFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
      map((user) =>
        isUserOfType(user, accountType)
          ? true
          : router.createUrlTree(redirectCommands)
      )
    );
  };
};

export const AuthGuard = AuthorizedOfTypeGuard(
  ExtendedAccountTypeEnum.AUTHORIZED
);

export const GuestGuard = AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.GUEST);
