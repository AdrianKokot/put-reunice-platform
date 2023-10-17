import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  ExtendedAccountType,
  ExtendedAccountTypeEnum,
} from '@reunice/modules/shared/data-access';
import { PermissionService } from './permission.service';
import { map } from 'rxjs';

export const AuthorizedOfTypeGuard = (
  accountType: ExtendedAccountType,
): CanMatchFn => {
  return () => {
    const router = inject(Router);

    return inject(PermissionService)
      .canMatch(accountType)
      .pipe(map((can) => (can ? can : router.createUrlTree(['/']))));
  };
};

export const AuthGuard = AuthorizedOfTypeGuard(
  ExtendedAccountTypeEnum.AUTHORIZED,
);

export const GuestGuard = AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.GUEST);
