import {
  filter,
  map,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AbstractApiService } from '@reunice/modules/shared/data-access';
import { inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

export const nestedRouteParamMap = (paramKey: string) => {
  const router = inject(Router);
  return router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let route = router.routerState.snapshot.root;
      while (route.firstChild) route = route.firstChild;

      return route.paramMap.get(paramKey);
    }),
    filter((id): id is string => id !== null),
    share(),
  );
};

export const resourceIdFromRoute = (paramKey = 'id') => {
  return inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get(paramKey)),
    filter((id): id is string => id !== null),
    shareReplay(),
  );
};

export const resourceFromRoute = <
  TResult extends {
    id: string | number;
  },
>(
  service: AbstractApiService<TResult, unknown, unknown>,
  tapFn?: (item: TResult) => void,
  paramKey = 'id',
) => {
  return resourceIdFromRoute(paramKey).pipe(
    switchMap((id) => service.get(id).pipe(tap(tapFn), startWith(null))),
    shareReplay(),
  );
};

export const formResourceFromRoute = <
  TResult extends {
    id: string | number;
  },
>(
  service: AbstractApiService<TResult, unknown, unknown>,
  form: FormGroup,
  paramKey: keyof TResult & string = 'id',
) => resourceFromRoute(service, (item) => form.patchValue(item), paramKey);
