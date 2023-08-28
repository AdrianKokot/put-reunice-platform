import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AbstractApiService } from './abstract-api.service';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { ApiParams } from '../api.params';

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

  override getAll(
    params: ApiParams<User> | ApiParams = {},
  ): Observable<User[]> {
    return super
      .getAll(params)
      .pipe(
        map((users) =>
          users.map((u) => ({ ...u, name: u.firstName + ' ' + u.lastName })),
        ),
      );
  }

  override update(
    resource: Partial<UpdateUser> & Pick<User, 'id'>,
  ): Observable<User> {
    return combineLatest([
      this._http.put<User>(`${this._resourceUrl}/${resource.id}`, resource),
      ...(resource.accountType !== 'ADMIN'
        ? [
            this._http.put<User>(
              `${this._resourceUrl}/${resource.id}/universities`,
              resource.enrolledUniversities,
            ),
          ]
        : []),
      // ...(resource.password
      //   ? [
      //       this._http.patch(`${this._resourceUrl}/${resource.id}/password`, resource.password),
      //     ]
      //   : []),
      this._http
        .patch(
          `${this._resourceUrl}/${resource.id}/username`,
          resource.username,
        )
        .pipe(catchError(() => of(true))),
    ]).pipe(switchMap(() => this.get(resource.id)));
  }

  override create(resource: Partial<UpdateUser>): Observable<User> {
    return this._http.post<User>(this._resourceUrl, resource).pipe(
      switchMap((user) =>
        this._http.put<User>(
          `${this._resourceUrl}/${user.id}/universities`,
          resource.enrolledUniversities,
        ),
      ),
      switchMap((user) => this.get(user.id)),
    );
  }
}
