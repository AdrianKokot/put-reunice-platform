import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { map, merge, startWith, Subscription } from 'rxjs';

@Pipe({
  name: 'localizedDate',
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform, OnDestroy {
  private _value: string | null = null;
  private _subscription: Subscription | null = null;

  constructor(
    private readonly _translate: TranslateService,
    private readonly _datePipe: DatePipe,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  transform(
    value: Date | string | number,
    format = 'medium',
    timezone?: string,
  ): string | null {
    if (this._subscription === null) {
      this._subscription = merge(
        this._translate.onDefaultLangChange,
        this._translate.onLangChange,
      )
        .pipe(
          map(({ lang }) => lang),
          startWith(this._translate.currentLang ?? this._translate.defaultLang),
          map((locale) =>
            this._datePipe.transform(value, format, timezone, locale),
          ),
        )
        .subscribe((val) => {
          this._value = val;
          this._cdr.markForCheck();
        });
    }

    return this._value;
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
