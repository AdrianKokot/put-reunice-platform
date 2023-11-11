import {
  catchError,
  exhaustMap,
  filter,
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
import { AbstractControl, FormGroup } from '@angular/forms';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TuiAlertService } from '@taiga-ui/core';
import { ERROR_SYMBOL_VALUE, LOADING_SYMBOL_VALUE } from './wrapper.symbols';
import { FieldViolationApiError } from '@reunice/modules/shared/data-access';

export interface FormSubmitWrapperFunctions<
  TControl extends {
    [K in keyof TControl]: AbstractControl<unknown, unknown>;
  },
  TResult,
> {
  /**
   * Function called on valid form submit
   */
  submit: (
    formValue: ReturnType<
      InstanceType<typeof FormGroup<TControl>>['getRawValue']
    >,
  ) => Observable<TResult>;
  /**
   * Function called after getting successful response from submit function
   */
  effect?: (result: TResult) => Observable<unknown>;
  /**
   * Message to show in alert after successful response from submit function
   */
  successAlertMessage?: string;
}

const INTERCEPTED_ERROR_CODES = new Set([404, 403, 500, 401]);

export const isValidationApiError = (
  error: HttpErrorResponse['error'],
): error is FieldViolationApiError => {
  return 'fieldViolations' in error;
};

export class FormSubmitWrapper<
  TControl extends {
    [K in keyof TControl]: AbstractControl<unknown, unknown>;
  },
  TResult,
> {
  private readonly _submit$ = new Subject<void>();
  private readonly _translate = inject(TranslateService);
  private readonly _alert = inject(TuiAlertService);

  private handleValidationApiError(form: FormGroup, err: HttpErrorResponse) {
    if (
      isValidationApiError(err.error) &&
      !INTERCEPTED_ERROR_CODES.has(err.status)
    ) {
      const fieldViolationError = err.error;

      for (const { field, message } of fieldViolationError.fieldViolations) {
        form
          .get(field)
          ?.setErrors({ server: this._translate.instant(message) });
      }

      if (fieldViolationError.fieldViolations.length === 0) {
        this._alert
          .open(this._translate.instant(err.error.message), {
            status: 'error',
          })
          .subscribe();
      }
    }
  }

  public readonly loading$: Observable<boolean> = this._submit$.pipe(
    takeUntilDestroyed(),
    tap(() => tuiMarkControlAsTouchedAndValidate(this.form)),
    filter(() => this.form.valid),
    exhaustMap(() =>
      this.functions.submit(this.form.getRawValue()).pipe(
        startWith(LOADING_SYMBOL_VALUE),
        catchError((err) => {
          if (err instanceof HttpErrorResponse)
            this.handleValidationApiError(this.form, err);

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
        return this.functions.effect(result).pipe(
          take(1),
          startWith(null),
          map(() => result),
        );
      }

      return of(result);
    }),
    map((result) => result === LOADING_SYMBOL_VALUE),
    startWith(false),
    shareReplay(1),
  );

  public submit() {
    this._submit$.next();
  }

  constructor(
    public readonly form: FormGroup<TControl>,
    readonly functions: FormSubmitWrapperFunctions<TControl, TResult>,
  ) {
    this.loading$.subscribe();
  }
}
