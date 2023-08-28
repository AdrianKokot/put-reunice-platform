import { Inject, Injectable } from '@angular/core';
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
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly _errorAlert$ = new Subject<{
    title?: string;
    message: string;
  }>();
  private readonly _ignoredUrls = ['/api/users/logged', '/api/login'];

  constructor(
    private readonly _router: Router,
    @Inject(TuiAlertService) readonly alert: TuiAlertService,
  ) {
    this._errorAlert$
      .pipe(
        exhaustMap(({ title, message }) =>
          alert.open(message, {
            status: TuiNotification.Error,
            label: title ?? 'Something went wrong',
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
        if (error.status === 404) {
          this._errorAlert$.next({
            title: 'Not found',
            message: 'The page you are looking for does not exist',
          });
        }

        if (error.status === 401) {
          return from(this._router.navigate(['/auth/login'])).pipe(
            switchMap(() => NEVER),
          );
        }

        if (error.status === 403) {
          this._errorAlert$.next({
            title: 'Forbidden',
            message: "You don't have permission to access this page",
          });
        }

        if (error.status === 500) {
          this._errorAlert$.next({
            title: 'Server error',
            message: 'Something went wrong on the server',
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
