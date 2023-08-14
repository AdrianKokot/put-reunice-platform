import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AbstractApiService } from './abstract-api.service';
import { combineLatest, Observable, switchMap } from 'rxjs';

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

  override update(
    resource: Partial<UpdateUser> & Pick<User, 'id'>
  ): Observable<User> {
    return combineLatest([
      this._http.put<User>(`${this._resourceUrl}/${resource.id}`, resource),
      this._http.put<User>(
        `${this._resourceUrl}/${resource.id}/universities`,
        resource.enrolledUniversities
      ),
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  override create(resource: Partial<UpdateUser>): Observable<User> {
    console.log(resource);
    return this._http.post<User>(this._resourceUrl, resource).pipe(
      switchMap((user) =>
        this._http.put<User>(
          `${this._resourceUrl}/${user.id}/universities`,
          resource.enrolledUniversities
        )
      ),
      switchMap((user) => this.get(user.id))
    );
  }
}
