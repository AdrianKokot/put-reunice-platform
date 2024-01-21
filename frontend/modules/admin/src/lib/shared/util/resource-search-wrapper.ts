import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  scan,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  AbstractApiService,
  ApiFilter,
  BaseResource,
} from '@reunice/modules/shared/data-access';
import {
  TuiContextWithImplicit,
  TuiHandler,
  tuiIsNumber,
  tuiIsString,
} from '@taiga-ui/cdk';
import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';

export class ResourceSearchWrapper<T extends BaseResource = BaseResource> {
  private readonly _search$ = new BehaviorSubject<string | null>('');
  private readonly _translate = inject(TranslateService);
  private readonly _additionalItems$ = new BehaviorSubject<T[]>([]);

  readonly items$ = this._search$.pipe(
    filter((value) => value !== null),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((search) =>
      this._service
        .getAll({
          ...this._additionalFilters,
          [this.searchKey]: search,
          size: 25,
        })
        .pipe(
          map(({ items }) => items),
          startWith(null),
        ),
    ),
    shareReplay(1),
  );

  private readonly _mergedSources$ = merge(
    this.items$,
    this._additionalItems$,
  ).pipe(
    scan((acc, values) => acc.concat(values ?? []), [] as T[]),
    startWith(null),
    shareReplay(1),
  );

  readonly itemIds$: Observable<ReadonlyArray<T['id']> | null> =
    this._mergedSources$.pipe(
      map((items) => (items !== null ? items.map((item) => item.id) : items)),
      shareReplay(1),
    );

  readonly stringify$: Observable<
    TuiHandler<TuiContextWithImplicit<T['id']> | T['id'], string>
  > = this._mergedSources$.pipe(
    filter((items): items is T[] => items !== null),
    map(
      (items) =>
        new Map(
          items.map<[T['id'], string]>((item) => [
            item.id,
            this.stringify(item),
          ]),
        ),
    ),
    startWith(new Map()),
    map(
      (map) => (id: TuiContextWithImplicit<T['id']> | T['id']) =>
        (tuiIsString(id) || tuiIsNumber(id)
          ? map.get(id)
          : map.get(id.$implicit)) || this._translate.instant('LOADING_DOTS'),
    ),
    shareReplay(1),
  );

  private readonly stringify: (item: T) => string;

  constructor(
    private readonly _service: AbstractApiService<T, unknown, unknown>,
    readonly searchKey: keyof ApiFilter<T>,
    stringify:
      | (OnlyKeysOfType<T, string> & string)
      | Array<OnlyKeysOfType<T, string> & string>
      | ((item: T) => string),
    private readonly _additionalFilters: ApiFilter<T> = {},
    additionalItems: T[] = [],
  ) {
    if (typeof stringify === 'function') {
      this.stringify = stringify;
    } else if (typeof stringify === 'string') {
      this.stringify = (item: T) => item[stringify]?.toString() ?? '';
    } else if (Array.isArray(stringify)) {
      this.stringify = (item: T) =>
        stringify.map((key) => item[key]?.toString() ?? '').join(' ');
    } else {
      console.error(
        `[${ResourceSearchWrapper.name}]: Invalid stringify`,
        stringify,
      );
      this.stringify = () => '';
    }

    if (additionalItems.length > 0) this.addItems(additionalItems);
  }

  search(text: string | null) {
    this._search$.next(text?.trim() ?? null);
  }

  openChange(open: boolean) {
    if (!open) {
      this.search('');
    }
  }

  addItem(item: T) {
    this.addItems([item]);
  }

  addItems(items: T[]) {
    this._additionalItems$.next(this._additionalItems$.value.concat(items));
  }
}

type OnlyKeysOfType<T, TProp> = keyof {
  [K in keyof T as T[K] extends TProp ? K : never]: T[K];
};
