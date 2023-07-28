import { University } from './university';

export type AccountType =
  | 'ADMIN'
  | 'MODERATOR'
  | 'USER'
  | 'GUEST'
  | 'AUTHORIZED';
export const AccountTypeEnum: Record<AccountType, AccountType> = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
  GUEST: 'GUEST',
  AUTHORIZED: 'AUTHORIZED',
} as const;

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  description: string;
  accountType: AccountType;
  enabled: boolean;
  enrolledUniversities: University[];
}

export interface UserForm {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  description: string;
  accountType: string;
}
