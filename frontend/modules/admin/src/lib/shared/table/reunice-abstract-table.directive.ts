import {
  Directive,
  HostBinding,
  inject,
  InjectionToken,
  OnInit,
  Provider,
  Type,
  ViewChild,
} from '@angular/core';
import {
  TuiSortByDirective,
  TuiTableDirective,
  TuiTablePaginationComponent,
} from '@taiga-ui/addon-table';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  AbstractApiService,
  ApiPagination,
  ApiSort,
} from '@reunice/modules/shared/data-access';
import { FormGroup } from '@angular/forms';

export const REUNICE_TABLE_SERVICE = new InjectionToken<
  AbstractApiService<
    object & {
      id: number | string;
    }
  >
>('REUNICE_TABLE_SERVICE');

export const provideReuniceTable = <T extends { id: string | number }>(
  service: Type<AbstractApiService<T, unknown, unknown>>
): Provider[] => {
  return [
    {
      provide: REUNICE_TABLE_SERVICE,
      useExisting: service,
    },
  ];
};

@Directive()
export abstract class ReuniceAbstractTable<T extends { id: number | string }>
  implements OnInit
{
  @ViewChild(TuiTablePaginationComponent, { static: true })
  private readonly _pagination: TuiTablePaginationComponent | null = null;

  @ViewChild(TuiSortByDirective, { static: true })
  private readonly _sortBy: TuiSortByDirective<T> | null = null;

  @ViewChild(TuiTableDirective, { static: true })
  private readonly _table: TuiTableDirective<T> | null = null;

  private readonly _items$ = new BehaviorSubject<T[] | null>(null);
  readonly items$ = this._items$.asObservable();

  abstract readonly columns: Array<keyof T | string>;
  abstract readonly filtersForm: FormGroup;

  protected readonly service = inject<AbstractApiService<T, unknown, unknown>>(
    REUNICE_TABLE_SERVICE
  );

  @HostBinding('style.--page-size')
  private _pageSize = 10;

  ngOnInit(): void {
    if (!this._sortBy || !this._table || !this._pagination) {
      throw new Error(
        ReuniceAbstractTable.name + ': missing required content child'
      );
    }

    this._pageSize = this._pagination.size;

    combineLatest([
      this._sortBy.tuiSortByChange.pipe(startWith(this._sortBy.tuiSortBy)),
      this._table.directionChange.pipe(startWith(this._table.direction)),
      this._pagination.paginationChange.pipe(
        startWith(this._pagination.pagination)
      ),
    ])
      .pipe(
        debounceTime(200),
        map(
          ([sort, direction, { page, size }]): ApiPagination & ApiSort<T> => ({
            sort: (typeof sort === 'string' && sort.length > 0
              ? (sort as keyof T).toString() +
                ',' +
                (direction === 1 ? 'asc' : 'desc')
              : undefined) as `${keyof T & string},${'asc' | 'desc'}`,
            page,
            size,
          })
        ),
        tap(({ size }) => (this._pageSize = size)),
        tap(console.debug),
        switchMap((apiParams) =>
          this.service.getAll(apiParams).pipe(
            startWith(null),
            catchError(() => of([]))
          )
        ),
        shareReplay()
      )
      .subscribe((x) => this._items$.next(x));
  }
}
