import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import {
  ExtendedAccountType,
  ExtendedAccountTypeEnum,
} from '@reunice/modules/shared/data-access';
import { PermissionService } from './permission.service';

export const AuthorizedOfTypeGuard = (
  accountType: ExtendedAccountType,
): CanMatchFn => {
  return () => inject(PermissionService).canMatch(accountType);
};

export const AuthGuard = AuthorizedOfTypeGuard(
  ExtendedAccountTypeEnum.AUTHORIZED,
);

export const GuestGuard = AuthorizedOfTypeGuard(ExtendedAccountTypeEnum.GUEST);
