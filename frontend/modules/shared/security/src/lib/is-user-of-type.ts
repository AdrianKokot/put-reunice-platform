import {
  ExtendedAccountType,
  ExtendedAccountTypeEnum,
  User,
} from '@reunice/modules/shared/data-access';

export const isUserOfType = (
  user: User | null,
  accountType: ExtendedAccountType,
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
