import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiActionModule, TuiMarkerIconModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { dashboardTiles } from '../../tiles';
import { AuthService, isUserOfType } from '@reunice/modules/shared/security';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';

@Component({
  selector: 'reunice-dashboard-tiles',
  standalone: true,
  imports: [
    CommonModule,
    TuiActionModule,
    RouterLink,
    TuiMarkerIconModule,
    TranslateModule,
  ],
  templateUrl: './dashboard-tiles.component.html',
  styleUrls: ['./dashboard-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTilesComponent {
  readonly links$ = inject(AuthService).user$.pipe(
    map((user) =>
      dashboardTiles.filter(
        (tile) => !tile.role || isUserOfType(user, tile.role),
      ),
    ),
  );
}
