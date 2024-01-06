import { University } from './university';
import { AccountType, AccountTypeEnum } from './account-type';

export interface User {
  accountType: AccountType;
  description: string;
  email: string;
  enabled: boolean;
  enrolledUniversities: University[];
  firstName: string;
  id: number;
  lastName: string;
  name: string;
  password: string;
  phoneNumber: string;
  username: string;
  lastLoginDate: string | null;
}

export class LoggedUser implements User {
  accountType: AccountType;
  description: string;
  email: string;
  enabled: boolean;
  enrolledUniversities: University[];
  firstName: string;
  id: number;
  lastLoginDate: string | null;
  lastName: string;
  name: string;
  password: string;
  phoneNumber: string;
  username: string;

  constructor(user: User) {
    this.accountType = user.accountType;
    this.description = user.description;
    this.email = user.email;
    this.enabled = user.enabled;
    this.enrolledUniversities = user.enrolledUniversities;
    this.firstName = user.firstName;
    this.id = user.id;
    this.lastLoginDate = user.lastLoginDate;
    this.lastName = user.lastName;
    this.name = user.name;
    this.password = user.password;
    this.phoneNumber = user.phoneNumber;
    this.username = user.username;
  }

  get universityId(): number | null {
    if (this.accountType === AccountTypeEnum.ADMIN) return null;

    return this.enrolledUniversities?.map((u) => u.id)?.at(0) ?? null;
  }
}
