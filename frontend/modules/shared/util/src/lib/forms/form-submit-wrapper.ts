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

export interface FormSubmitWrapperFunctions<
  TControl extends {
    [K in keyof TControl]: AbstractControl<unknown, unknown>;
  },
  TResult
> {
  submit: (
    formValue: ReturnType<
      InstanceType<typeof FormGroup<TControl>>['getRawValue']
    >
  ) => Observable<TResult>;
  effect: (result: TResult) => Observable<unknown>;
}

const FORM_SUBMIT_WRAPPER_LOADING_VALUE = Symbol(
  'FORM_SUBMIT_WRAPPER_LOADING_VALUE'
);
const FORM_SUBMIT_WRAPPER_ERROR_VALUE = Symbol(
  'FORM_SUBMIT_WRAPPER_LOADING_VALUE'
);

export const handleValidationApiError = (
  form: FormGroup,
  err: HttpErrorResponse
) => {
  // TODO Handle validation errors
  console.log(err);
};

export class FormSubmitWrapper<
  TControl extends {
    [K in keyof TControl]: AbstractControl<unknown, unknown>;
  },
  TResult
> {
  private readonly _submit$ = new Subject<void>();

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
        })
      )
    ),
    mergeMap((result) => {
      if (this.functions.effect && typeof result !== 'symbol') {
        return this.functions.effect(result).pipe(
          take(1),
          startWith(null),
          map(() => result)
        );
      }

      return of(result);
    }),
    map((result) => result === FORM_SUBMIT_WRAPPER_LOADING_VALUE),
    startWith(false),
    shareReplay()
  );

  public submit() {
    this._submit$.next();
  }

  constructor(
    public readonly form: FormGroup<TControl>,
    readonly functions: FormSubmitWrapperFunctions<TControl, TResult>
  ) {
    this.loading$.subscribe();
  }
}
