export type ApiSort = {
  sort?: string;
  direction?: 'asc' | 'desc';
};

export type ApiPagination = {
  page?: number;
  pageSize?: number;
};

type ApiFilterOperator<T, TOperator extends string> = {
  [K in keyof T as `${K & string}_${TOperator}`]?: T[K];
};

type OnlyKeysOfType<T, TProp> = {
  [K in keyof T as T[K] extends TProp ? K : never]: T[K];
};

export type ApiFilter<T> =
  | ApiFilterOperator<T, 'eq'> &
      ApiFilterOperator<OnlyKeysOfType<T, string>, 'ct'>;

export type ApiParams<T = object> = ApiSort & ApiPagination & ApiFilter<T>;
