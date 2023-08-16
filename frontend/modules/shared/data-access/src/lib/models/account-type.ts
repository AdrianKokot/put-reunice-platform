export type AccountType = 'ADMIN' | 'MODERATOR' | 'USER';

export type ExtendedAccountType =
  | AccountType
  | 'GUEST'
  | 'AUTHORIZED'
  | 'ADMINISTRATIVE';

export const AccountTypeEnum: Record<AccountType, AccountType> = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
} as const;

export const ExtendedAccountTypeEnum: Record<
  ExtendedAccountType,
  ExtendedAccountType
> = {
  ...AccountTypeEnum,
  GUEST: 'GUEST',
  AUTHORIZED: 'AUTHORIZED',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
} as const;
