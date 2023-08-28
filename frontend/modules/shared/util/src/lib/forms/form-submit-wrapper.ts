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
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

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

const FORM_SUBMIT_WRAPPER_LOADING_VALUE = Symbol(
  'FORM_SUBMIT_WRAPPER_LOADING_VALUE',
);
const FORM_SUBMIT_WRAPPER_ERROR_VALUE = Symbol(
  'FORM_SUBMIT_WRAPPER_LOADING_VALUE',
);

export const handleValidationApiError = (
  form: FormGroup,
  err: HttpErrorResponse,
) => {
  // TODO Handle validation errors
  console.log(err);
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

  public readonly loading$ = this._submit$.pipe(
    takeUntilDestroyed(),
    tap(() => tuiMarkControlAsTouchedAndValidate(this.form)),
    filter(() => this.form.valid),
    exhaustMap(() =>
      this.functions.submit(this.form.getRawValue()).pipe(
        startWith(FORM_SUBMIT_WRAPPER_LOADING_VALUE),
        catchError((err) => {
          if (err instanceof HttpErrorResponse)
            handleValidationApiError(this.form, err);

          return of(FORM_SUBMIT_WRAPPER_ERROR_VALUE);
        }),
      ),
    ),
    tap((result) => {
      if (typeof result !== 'symbol' && this.functions.successAlertMessage) {
        this._alert
          .open(this._translate.instant(this.functions.successAlertMessage), {
            status: TuiNotification.Success,
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
    map((result) => result === FORM_SUBMIT_WRAPPER_LOADING_VALUE),
    startWith(false),
    shareReplay(),
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
