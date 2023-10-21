import {
  Directive,
  HostBinding,
  inject,
  OnInit,
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
import { FormGroup } from '@angular/forms';
import { REUNICE_TABLE_SERVICE } from './table.provider';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import {
  AbstractApiService,
  ApiPagination,
  ApiParams,
  ApiSort,
  BaseResource,
} from '@reunice/modules/shared/data-access';
import { TUI_NOTHING_FOUND_MESSAGE } from '@taiga-ui/core';
import { TableStorageKeys } from '../storage';
import { tuiIsNumber } from '@taiga-ui/cdk';

@Directive()
export abstract class ReuniceAbstractTable<T extends BaseResource>
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

  private readonly _total$ = new BehaviorSubject<number | null>(null);
  readonly total$ = this._total$.asObservable();

  abstract readonly columns: Array<keyof T | string>;
  abstract readonly filtersForm: FormGroup;

  protected readonly service = inject<AbstractApiService<T, unknown, unknown>>(
    REUNICE_TABLE_SERVICE,
  );

  private readonly _refresh$ = new BehaviorSubject<void>(undefined);

  private readonly _storage = inject(LOCAL_STORAGE);

  protected readonly emptyMessage$ = inject(TUI_NOTHING_FOUND_MESSAGE);

  @HostBinding('style.--page-size')
  private _pageSize = 10;

  ngOnInit(): void {
    if (!this._sortBy || !this._table || !this._pagination) {
      throw new Error(
        ReuniceAbstractTable.name + ': missing required content child.',
      );
    }

    const pageSize = parseInt(
      this._storage.getItem(TableStorageKeys.PageSize) ?? '0',
    );
    if (tuiIsNumber(pageSize) && pageSize > 0) this._pagination.size = pageSize;

    this._pageSize = this._pagination.size;

    combineLatest([
      this._sortBy.tuiSortByChange.pipe(startWith(this._sortBy.tuiSortBy)),
      this._table.directionChange.pipe(startWith(this._table.direction)),
      this._pagination.paginationChange.pipe(
        tap(({ size }) =>
          this._storage.setItem(TableStorageKeys.PageSize, size.toString()),
        ),
        startWith(this._pagination.pagination),
      ),
      this.filtersForm.valueChanges.pipe(
        startWith(null),
        debounceTime(300),
        map(() => this.filtersForm.getRawValue()),
      ),
      this._refresh$,
    ])
      .pipe(
        debounceTime(200),
        map(
          ([sort, direction, { page, size }, filters]): ApiPagination &
            ApiSort<T> &
            ApiParams => ({
            sort: (typeof sort === 'string' && sort.length > 0
              ? (sort as keyof T).toString() +
                ',' +
                (direction === 1 ? 'asc' : 'desc')
              : undefined) as `${keyof T & string},${'asc' | 'desc'}`,
            page,
            size,
            ...filters,
          }),
        ),
        tap(({ size }) => (this._pageSize = size)),
        switchMap((apiParams) =>
          this.service.getAll(apiParams).pipe(
            map(({ items, totalItems }) => {
              this._total$.next(totalItems);
              return items;
            }),
            startWith(null),
            catchError(() => of([])),
          ),
        ),
        shareReplay(),
      )
      .subscribe((x) => this._items$.next(x));
  }

  refresh() {
    this._refresh$.next();
  }
}
