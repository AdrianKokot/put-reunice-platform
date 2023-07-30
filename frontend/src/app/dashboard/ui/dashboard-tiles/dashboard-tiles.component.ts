import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-dashboard-tiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-tiles.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTilesComponent {}
