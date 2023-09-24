import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  startWith,
  Subject,
  Subscription,
} from 'rxjs';
import { LangService, langToLocale } from '@reunice/modules/shared/util';

@Pipe({
  name: 'localizedDate',
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform, OnDestroy {
  private _value: string | null = null;
  private _subscription: Subscription | null = null;
  private readonly _pipedValue = new Subject<
    Date | string | number | undefined | null
  >();

  constructor(
    private readonly _lang: LangService,
    private readonly _datePipe: DatePipe,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  transform(
    value: Date | string | number | undefined | null,
    format = 'medium',
    timezone?: string,
  ): string | null {
    if (this._subscription === null) {
      this._subscription = combineLatest({
        locale: this._lang.lang$.pipe(map(langToLocale)),
        value: this._pipedValue.pipe(startWith(value), distinctUntilChanged()),
      })
        .pipe(
          map(({ value, locale }) =>
            this._datePipe.transform(value, format, timezone, locale),
          ),
        )
        .subscribe((val) => {
          this._value = val;
          this._cdr.markForCheck();
        });
    }

    this._pipedValue.next(value);
    return this._value;
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
