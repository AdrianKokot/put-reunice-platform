import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  merge,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '@reunice/modules/shared/data-access';
import { throwError } from '@reunice/modules/shared/util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _resourceUrl = '/api/users';
  private readonly _http = inject(HttpClient);
  private readonly _user$ = new Subject<User | null>();

  private _userSnapshot: User | null = null;
  readonly user$ = merge(this._user$, this.getUser()).pipe(
    tap((user) => (this._userSnapshot = user)),
    shareReplay(1),
  );

  get userSnapshot() {
    return this._userSnapshot;
  }

  private getUser() {
    return this._http
      .get<User>('/api/users/logged')
      .pipe(catchError(() => of(null)));
  }

  login(user: Pick<User, 'password' | 'username'>): Observable<User | null> {
    return this._http.post('/api/login', user).pipe(
      switchMap(() => this.getUser()),
      tap((user) => this._user$.next(user)),
    );
  }

  logout(): Observable<void> {
    return this._http
      .get<void>('/api/logout')
      .pipe(tap(() => this._user$.next(null)));
  }

  changePassword(data: { newPassword: string; oldPassword: string }) {
    const { id } = this._userSnapshot ?? throwError('User not logged in');

    return this._http.patch<void>(`${this._resourceUrl}/${id}`, data);
  }

  update(data: Pick<User, 'firstName' | 'lastName' | 'email' | 'phoneNumber'>) {
    const { id } = this._userSnapshot ?? throwError('User not logged in');

    return this._http.put<User>(`${this._resourceUrl}/${id}`, data);
  }
}
