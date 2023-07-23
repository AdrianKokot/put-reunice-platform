import { University } from './university';

export enum AccountType {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER',
  Guest = 'GUEST',
  Authorized = 'AUTHORIZED',
}

export const ACCOUNT_TYPES = new Set<string>(Object.values(AccountType));

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
