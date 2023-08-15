import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '@reunice/modules/shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _user$ = new Subject<User | null>();

  private _userSnapshot: User | null = null;
  readonly user$ = this._user$.pipe(
    tap((user) => (this._userSnapshot = user)),
    shareReplay()
  );

  get userSnapshot() {
    return this._userSnapshot;
  }

  constructor() {
    this.getUser().subscribe((user) => this._user$.next(user));
  }

  private getUser() {
    return this._http
      .get<User>('/api/users/logged')
      .pipe(catchError(() => of(null)));
  }

  login(user: Pick<User, 'password' | 'username'>): Observable<User | null> {
    return this._http.post('/api/login', user).pipe(
      switchMap(() => this.getUser()),
      tap((user) => this._user$.next(user))
    );
  }

  logout(): Observable<void> {
    return this._http
      .get<void>('/api/logout')
      .pipe(tap(() => this._user$.next(null)));
  }
}
