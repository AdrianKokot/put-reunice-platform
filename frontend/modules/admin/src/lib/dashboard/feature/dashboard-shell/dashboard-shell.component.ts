import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreadcrumbService } from '@reunice/modules/shared/util';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { TuiLinkModule } from '@taiga-ui/core';
import { map } from 'rxjs';

@Component({
  selector: 'reunice-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './dashboard-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardShellComponent {
  private readonly _breadcrumbService = inject(BreadcrumbService);

  breadcrumbs$ = this._breadcrumbService.breadcrumbs$;
  // .pipe(map((breadcrumbs) => breadcrumbs.slice(0, breadcrumbs.length - 1)));
  title$ = this._breadcrumbService.breadcrumbs$.pipe(
    map((breadcrumbs) => breadcrumbs[breadcrumbs.length - 1]?.title)
  );
}
