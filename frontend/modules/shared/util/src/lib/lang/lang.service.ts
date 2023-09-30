import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, map, merge, shareReplay, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly _translate = inject(TranslateService);

  public readonly lang$ = merge(
    this._translate.onDefaultLangChange,
    this._translate.onLangChange,
  ).pipe(
    map(({ lang }) => lang),
    startWith(this._translate.currentLang ?? this._translate.defaultLang),
    distinctUntilChanged(),
    shareReplay(),
  );
}
