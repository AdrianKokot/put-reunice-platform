import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiParams } from '../api.params';

export abstract class AbstractApiService<
  T extends { id: number | string } = { id: number },
  TCreatePayload = T,
  TUpdatePayload = T
> {
  private _http = inject(HttpClient);

  protected constructor(private _resourceUrl: string) {}

  get(id: T['id']) {
    return this._http.get<T>(`${this._resourceUrl}/${id}`);
  }

  getAll(params: ApiParams<T> | ApiParams) {
    return this._http.get<T[]>(this._resourceUrl, {
      params: new HttpParams({ fromObject: params }),
    });
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