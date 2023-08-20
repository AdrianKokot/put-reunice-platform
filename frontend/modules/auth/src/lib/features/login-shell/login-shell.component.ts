import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@reunice/modules/shared/security';
import {
  catchError,
  exhaustMap,
  filter,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'reunice-login-shell',
  templateUrl: './login-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginShellComponent {
  private readonly _auth = inject(AuthService);
  private readonly _router = inject(Router);

  readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly submit$ = new Subject<void>();
  readonly showLoader$ = this.submit$.pipe(
    filter(() => {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return false;
      }

      return true;
    }),
    exhaustMap(() =>
      this._auth.login(this.form.getRawValue()).pipe(
        switchMap(() => this._router.navigate(['/'])),
        catchError((err: HttpErrorResponse) => {
          // TODO Handle validation errors
          console.log(err);
          return of(false);
        }),
        startWith(true)
      )
    )
  );
}
