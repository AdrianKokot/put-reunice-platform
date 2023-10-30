import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AbstractApiService } from './abstract-api.service';

type UpdateUser = Omit<User, 'enrolledUniversities'> & {
  enrolledUniversities: number[];
};

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractApiService<
  User,
  UpdateUser,
  UpdateUser
> {
  constructor() {
    super('/api/users');
  }
}
