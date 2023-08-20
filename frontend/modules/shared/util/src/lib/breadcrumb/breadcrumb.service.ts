import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, shareReplay, startWith } from 'rxjs';

export interface Breadcrumb {
  title: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _route = inject(ActivatedRoute);

  public readonly breadcrumbs$ = inject(Router).events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      const breadcrumbs: Breadcrumb[] = [];

      let currentUrl = '';
      let route = this._route.root;

      while (route.firstChild) {
        route = route.firstChild;

        if (route.snapshot.url.toString() !== '')
          currentUrl += '/' + route.snapshot.url.toString();

        const title = route.snapshot.title;
        if (title && title !== breadcrumbs.at(-1)?.title) {
          breadcrumbs.push({
            title,
            url: currentUrl,
          });
        }
      }

      return breadcrumbs;
    }),
    shareReplay()
  );
}
