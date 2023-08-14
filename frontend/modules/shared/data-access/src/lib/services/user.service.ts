import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {AbstractApiService} from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractApiService<User> {
  constructor() {
    super('/api/users');
  }
}
