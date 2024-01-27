import { InjectionToken, Provider, Type } from '@angular/core';
import {
  AbstractApiService,
  BaseResource,
} from '@eunice/modules/shared/data-access';

export const eunice_TABLE_SERVICE = new InjectionToken<
  AbstractApiService<BaseResource, unknown, unknown>
>('eunice_TABLE_SERVICE');

export const provideeuniceTable = <T extends { id: string | number }>(
  service: Type<AbstractApiService<T, unknown, unknown>>,
): Provider[] => {
  return [
    {
      provide: eunice_TABLE_SERVICE,
      useExisting: service,
    },
  ];
};
