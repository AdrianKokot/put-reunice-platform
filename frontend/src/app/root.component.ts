import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SideService } from './shared/side.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'reunice-root',
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./root.component.less'],
})
export class RootComponent {
  readonly side = inject(SideService);

  readonly mobileVisible$ = inject(BreakpointObserver)
    .observe('(max-width: 47.9625em)')
    .pipe(
      takeUntilDestroyed(),
      map(({ matches }) => matches),
      distinctUntilChanged(),
    );
}
