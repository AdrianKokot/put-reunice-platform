import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  take,
  tap,
} from 'rxjs';
import { inject } from '@angular/core';
import { ERROR_SYMBOL_VALUE, LOADING_SYMBOL_VALUE } from './wrapper.symbols';
import { HttpErrorResponse } from '@angular/common/http';
import { TuiAlertService } from '@taiga-ui/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AbstractApiService,
  BaseResource,
} from '@reunice/modules/shared/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isValidationApiError } from './form-submit-wrapper';

export interface DeleteResourceWrapperFunctions {
  /**
   * Function called after getting successful response from delete function
   */
  effect?: () => Observable<unknown>;
  /**
   * Message to show in alert after successful response from delete function
   */
  successAlertMessage?: string;
}

export class DeleteResourceWrapper<
  TResource extends BaseResource,
  TService extends AbstractApiService<
    TResource,
    unknown,
    unknown
  > = AbstractApiService<TResource, unknown, unknown>,
> {
  private readonly _delete$ = new Subject<TResource['id']>();
  private readonly _translate = inject(TranslateService);
  private readonly _alert = inject(TuiAlertService);

  public readonly loading$ = this._delete$.pipe(
    takeUntilDestroyed(),
    exhaustMap((id) =>
      this.deleteMethod(id).pipe(
        startWith(LOADING_SYMBOL_VALUE),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (isValidationApiError(err.error)) {
              return this._alert
                .open(this._translate.instant(err.error.message), {
                  status: 'error',
                  label: this._translate.instant('ERROR'),
                })
                .pipe(
                  startWith(null),
                  map(() => ERROR_SYMBOL_VALUE),
                );
            }

            return this._alert
              .open(this._translate.instant('ERROR_DURING_DELETE'), {
                status: 'error',
              })
              .pipe(
                startWith(null),
                map(() => ERROR_SYMBOL_VALUE),
              );
          }

          return of(ERROR_SYMBOL_VALUE);
        }),
      ),
    ),
    tap((result) => {
      if (typeof result !== 'symbol' && this.functions.successAlertMessage) {
        this._alert
          .open(this._translate.instant(this.functions.successAlertMessage), {
            status: 'success',
          })
          .subscribe();
      }
    }),
    mergeMap((result) => {
      if (this.functions.effect && typeof result !== 'symbol') {
        return this.functions.effect().pipe(
          take(1),
          startWith(null),
          map(() => result),
        );
      }

      return of(result);
    }),
    map((result) => result === LOADING_SYMBOL_VALUE),
    startWith(false),
    shareReplay(),
  );

  private deleteMethod: (id: TResource['id']) => Observable<boolean> = (id) =>
    this.service.delete(id);

  public delete(
    id: TResource['id'],
    // @ts-expect-error Generics sometimes don't work well with this
    method: ObservableOneArgumentMethods<TResource, TService> = 'delete',
  ) {
    this.deleteMethod = (id) => this.service[method](id);
    this._delete$.next(id);
  }

  constructor(
    public readonly service: TService,
    readonly functions: DeleteResourceWrapperFunctions = {},
  ) {
    this.loading$.subscribe();
  }
}

type ObservableOneArgumentMethods<
  TResource extends BaseResource,
  TService extends AbstractApiService<TResource, unknown, unknown>,
> = {
  [TKey in keyof TService]: TService[TKey] extends (
    arg: TResource['id'],
  ) => Observable<boolean>
    ? TKey
    : never;
}[keyof TService];
