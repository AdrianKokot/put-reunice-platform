/* eslint-disable @typescript-eslint/consistent-type-definitions */
type ApiFilterOperator<T, TOperator extends string> = {
  [K in keyof T as `${K & string}_${TOperator}`]?:
    | T[K]
    | string
    | ApiFilterValue;
};

type ApiFilterValue = string | number | boolean | null | undefined;

type OnlyKeysOfType<T, TProp> = {
  [K in keyof T as T[K] extends TProp ? K : never]: T[K];
};

export type ApiFilter<T> = ApiFilterOperator<T, 'eq'> &
  ApiFilterOperator<OnlyKeysOfType<T, string>, 'ct'> &
  Partial<{ search: string }> &
  Partial<{ unseen: boolean }>;

export type ApiSort<T = object> = {
  sort: `${keyof T & string},${'asc' | 'desc'}` & string;
};

export type ApiPagination = {
  page: number;
  size: number;
};

export type ApiParams<T = object> = Partial<ApiSort<T>> &
  Partial<ApiPagination> &
  ApiFilter<T>;

export type ApiPaginatedResponse<T> = {
  totalItems: number;
  items: T[];
};
