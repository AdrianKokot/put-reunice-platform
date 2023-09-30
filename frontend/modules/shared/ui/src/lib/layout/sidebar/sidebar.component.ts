import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneDirective } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { distinctUntilChanged, filter, map, merge, Subject } from 'rxjs';

@Component({
  selector: 'reunice-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiSidebarModule,
    PolymorpheusModule,
  ],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly _zone = inject(TuiActiveZoneDirective, { self: true });
  private readonly _router = inject(Router);
  readonly click$ = new Subject<void>();

  readonly open$ = merge(
    this._zone.tuiActiveZoneChange,
    this.click$.pipe(map(() => true)),
    this._router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => false),
    ),
  ).pipe(distinctUntilChanged());
}
