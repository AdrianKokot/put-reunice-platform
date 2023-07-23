import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '@reunice/modules/shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _checkUserTrigger = new BehaviorSubject(null);

  readonly user$ = this._checkUserTrigger.pipe(
    switchMap(() =>
      this._http.get<User>('/api/users/logged').pipe(catchError(() => of(null)))
    ),
    shareReplay()
  );

  logout() {
    return this._http
      .get('/api/logout')
      .pipe(tap(() => this._checkUserTrigger.next(null)));
  }
}
