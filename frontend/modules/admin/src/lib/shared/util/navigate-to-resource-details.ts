import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

/**
 * @description Creates a function that navigates to the resource details page.
 * @example new FormSubmitWrapper(..., { effect: navigateToResourceDetails() })
 */
export const navigateToResourceDetails = (
  additionalCommands: Parameters<Router['navigate']>[0] = [],
) => {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  return (result: { id: number | string }) =>
    fromPromise(
      router.navigate(
        [
          '..',
          ...(route.snapshot.url.toString() === 'edit' ? [] : [result.id]),
          ...additionalCommands,
        ],
        {
          relativeTo: route,
        },
      ),
    );
};

export const navigateToResourceList = (
  additionalCommands: Parameters<Router['navigate']>[0] = [],
) => {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  return () =>
    fromPromise(
      router.navigate(['..', ...additionalCommands], {
        relativeTo: route,
      }),
    );
};
