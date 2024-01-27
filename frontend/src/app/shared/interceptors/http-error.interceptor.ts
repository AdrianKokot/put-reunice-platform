import { Inject, Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  catchError,
  exhaustMap,
  from,
  NEVER,
  Observable,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '@eunice/modules/shared/security';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly _errorAlert$ = new Subject<{
    title?: string;
    message: string;
  }>();
  private readonly _ignoredUrls = ['/api/users/logged', '/api/login'];

  private _translate: TranslateService | null = null;

  constructor(
    private readonly _router: Router,
    private readonly _injector: Injector,
    private readonly _auth: AuthService,
    @Inject(TuiAlertService) readonly alert: TuiAlertService,
  ) {
    this._errorAlert$
      .pipe(
        exhaustMap(({ title, message }) =>
          alert.open(message, {
            status: 'error',
            label: title,
            autoClose: true,
            hasCloseButton: true,
          }),
        ),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (
      !request.url.includes('/api/') ||
      this._ignoredUrls.includes(request.url)
    ) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 || error.status === 500) {
          this._errorAlert$.next({
            title: this.translate(`ERROR_${error.status}_TITLE`),
            message: this.translate(`ERROR_${error.status}_MESSAGE`),
          });
        }

        if (error.status === 401) {
          return this._auth.logout().pipe(
            switchMap(() => from(this._router.navigate(['/auth/login']))),
            switchMap(() => NEVER),
          );
        }

        if (error.status === 404) {
          return from(this._router.navigate(['/not-found'])).pipe(
            switchMap(() => NEVER),
          );
        }

        return throwError(() => error);
      }),
    );
  }

  private translate(key: string): string {
    if (this._translate === null)
      this._translate = this._injector.get(TranslateService);

    return this._translate?.instant(key) ?? '';
  }
}
