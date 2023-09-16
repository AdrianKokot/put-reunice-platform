import { InjectionToken, Provider, Type } from '@angular/core';
import {
  AbstractApiService,
  BaseResource,
} from '@reunice/modules/shared/data-access';

export const REUNICE_TABLE_SERVICE = new InjectionToken<
  AbstractApiService<BaseResource, unknown, unknown>
>('REUNICE_TABLE_SERVICE');

export const provideReuniceTable = <T extends { id: string | number }>(
  service: Type<AbstractApiService<T, unknown, unknown>>,
): Provider[] => {
  return [
    {
      provide: REUNICE_TABLE_SERVICE,
      useExisting: service,
    },
  ];
};
