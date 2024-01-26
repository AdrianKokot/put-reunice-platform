import { inject, Injectable } from '@angular/core';
import { ExtendedAccountType } from '@eunice/modules/shared/data-access';
import { first, map, Observable, share } from 'rxjs';
import { AuthService } from './auth.service';
import { isUserOfType } from './is-user-of-type';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly _user$ = inject(AuthService).user$.pipe(share());

  public canMatch(requiredRole: ExtendedAccountType): Observable<boolean> {
    return this._user$.pipe(
      first(),
      map((user) => isUserOfType(user, requiredRole)),
    );
  }
}
