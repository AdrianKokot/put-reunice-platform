import {
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AbstractApiService } from '@reunice/modules/shared/data-access';
import { inject } from '@angular/core';

export const mapToApiResource = <TResult extends { id: string | number }>(
  service: AbstractApiService<TResult>,
  tapFn?: (item: TResult) => void,
  paramKey: keyof TResult & string = 'id'
) => {
  return function (source: Observable<ParamMap>) {
    return source.pipe(
      map((params) => params.get(paramKey)),
      filter((id): id is string => id !== null),
      switchMap((id) => service.get(id).pipe(tap(tapFn), startWith(null))),
      shareReplay()
    );
  };
};

export const resourceFromRoute = <
  TResult extends {
    id: string | number;
  }
>(
  service: AbstractApiService<TResult>,
  tapFn?: (item: TResult) => void,
  paramKey: keyof TResult & string = 'id'
) => {
  return inject(ActivatedRoute).paramMap.pipe(
    mapToApiResource(service, tapFn, paramKey)
  );
};
