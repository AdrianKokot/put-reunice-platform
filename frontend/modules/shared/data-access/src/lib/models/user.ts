import { University } from './university';
import { AccountType } from './account-type';

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
}
