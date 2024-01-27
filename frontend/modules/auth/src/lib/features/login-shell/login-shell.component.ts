import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@eunice/modules/shared/security';
import { Router } from '@angular/router';
import { FormSubmitWrapper } from '@eunice/modules/shared/util';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'eunice-login-shell',
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

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (formValue) => this._auth.login(formValue),
    effect: () => fromPromise(this._router.navigate(['/admin'])),
  });
}
