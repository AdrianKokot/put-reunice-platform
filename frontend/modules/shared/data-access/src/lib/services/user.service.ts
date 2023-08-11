import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractApiService<User> {
  private readonly userUrl = '/api/users';

  public loggedUser!: User | null;

  constructor() {
    super('/api/users');
  }

  login(user: { username: string; password: string }): Observable<unknown> {
    return this._http.post<unknown>('/api/login', user);
  }

  logout(): Observable<unknown> {
    return this._http.get<unknown>('/api/logout');
  }

  getLoggedUser(): Observable<User> {
    return this._http.get<User>(`${this.userUrl}/logged`);
  }
}
