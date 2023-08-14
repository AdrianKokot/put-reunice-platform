import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  AbstractApiService,
  ApiFilter,
} from '@reunice/modules/shared/data-access';
import {
  TuiContextWithImplicit,
  TuiHandler,
  tuiIsNumber,
  tuiIsString,
} from '@taiga-ui/cdk';

export class ResourceSearchWrapper<T extends { id: string | number }> {
  private readonly _search$ = new BehaviorSubject<string>('');

  readonly items$ = this._search$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((search) => this._service.getAll({ [this.searchKey]: search })),
    shareReplay()
  );

  readonly itemIds$: Observable<ReadonlyArray<T['id']> | null> =
    this.items$.pipe(
      map((items) => items.map((item) => item.id)),
      shareReplay()
    );

  readonly stringify$: Observable<
    TuiHandler<TuiContextWithImplicit<T['id']> | T['id'], string>
  > = this.items$.pipe(
    map(
      (items) =>
        new Map(
          items.map<[T['id'], string]>((item) => [
            item.id,
            item[this.stringifyKey]?.toString() ?? '',
          ])
        )
    ),
    startWith(new Map()),
    map(
      (map) => (id: TuiContextWithImplicit<T['id']> | T['id']) =>
        (tuiIsString(id) || tuiIsNumber(id)
          ? map.get(id)
          : map.get(id.$implicit)) || 'Loading...'
    )
  );

  constructor(
    private readonly _service: AbstractApiService<T>,
    readonly searchKey: keyof ApiFilter<T>,
    readonly stringifyKey: OnlyKeysOfType<T, string> & string
  ) {}

  search(text: string | null) {
    this._search$.next(text?.trim() ?? '');
  }
}

type OnlyKeysOfType<T, TProp> = keyof {
  [K in keyof T as T[K] extends TProp ? K : never]: T[K];
};
