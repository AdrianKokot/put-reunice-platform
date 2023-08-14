import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import {
  AccountType,
  AccountTypeEnum,
  User,
} from '@reunice/modules/shared/data-access';

const isUserOfType = (user: User | null, accountType: AccountType): boolean => {
  if (accountType === AccountTypeEnum.GUEST) {
    return user === null;
  }

  if (accountType === AccountTypeEnum.AUTHORIZED) {
    return user !== null;
  }

  return user?.accountType === accountType;
};

export const AuthorizedOfTypeGuard = (
  accountType: AccountType,
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

export const AuthGuard = AuthorizedOfTypeGuard(AccountTypeEnum.AUTHORIZED);

export const GuestGuard = AuthorizedOfTypeGuard(AccountTypeEnum.GUEST);
