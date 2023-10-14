import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { first, map, Observable, share, tap } from 'rxjs';
import { isUserOfType } from './is-user-of-type';
import { ExtendedAccountType } from '@reunice/modules/shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly _user$ = inject(AuthService).user$.pipe(share());

  public canMatch(requiredRole: ExtendedAccountType): Observable<boolean> {
    return this._user$.pipe(
      first(),
      map((user) => isUserOfType(user, requiredRole)),
      tap((canMatch) =>
        console.debug('PermissionService@canMatch', requiredRole, canMatch),
      ),
    );
  }
}
