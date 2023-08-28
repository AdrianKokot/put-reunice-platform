import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiPaginatedResponse, ApiParams } from '../api.params';
import { BaseResource } from '../models/base-resource';

export const TOTAL_ITEMS_HEADER = 'X-Whole-Content-Length';

export const toHttpParams = <T>(params: ApiParams<T> | ApiParams) => {
  const fromObject = (Object.keys(params) as Array<keyof typeof params>).reduce(
    (acc, key) => {
      const val = params[key];
      if (val !== '' && val !== undefined && val !== null) {
        acc[key] = val;
      }
      return acc;
    },
    {} as Record<string, string | number | boolean>,
  );

  return new HttpParams({ fromObject });
};

export abstract class AbstractApiService<
  T extends BaseResource = BaseResource,
  TCreatePayload = T,
  TUpdatePayload = T,
> {
  protected readonly _http = inject(HttpClient);

  protected constructor(protected readonly _resourceUrl: string) {}

  get(id: T['id'] | BaseResource['id']) {
    return this._http.get<T>(`${this._resourceUrl}/${id}`);
  }

  getAll(params: ApiParams<T> = {}) {
    return this._http
      .get<T[]>(this._resourceUrl, {
        params: toHttpParams(params),
        observe: 'response',
      })
      .pipe(
        map(
          ({ body, headers }): ApiPaginatedResponse<T> => ({
            totalItems: Number(headers.get(TOTAL_ITEMS_HEADER)),
            items: body ?? [],
          })
        )
      );
  }

  create(resource: Partial<TCreatePayload>) {
    return this._http.post<T>(this._resourceUrl, resource);
  }

  update(resource: Partial<TUpdatePayload> & Pick<T, 'id'>) {
    return this._http.put<T>(`${this._resourceUrl}/${resource.id}`, resource);
  }

  delete(id: T['id']) {
    return this._http
      .delete(`${this._resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(({ status }) => status >= 200 && status < 300));
  }
}
