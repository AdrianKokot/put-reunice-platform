import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiActionModule, TuiMarkerIconModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

interface DashboardTile {
  title: string;
  url: RouterLink['routerLink'];
  icon: string;
  description: string;
}

@Component({
  selector: 'reunice-dashboard-tiles',
  standalone: true,
  imports: [CommonModule, TuiActionModule, RouterLink, TuiMarkerIconModule],
  templateUrl: './dashboard-tiles.component.html',
  styleUrls: ['./dashboard-tiles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTilesComponent {
  readonly links$ = of([
    {
      title: 'Universities',
      url: ['universities'],
      icon: 'tuiIconHome',
      description: 'Universities management',
    },
    {
      title: 'Templates',
      url: ['templates'],
      icon: 'tuiIconMap',
      description: 'Templates for university pages',
    },
    {
      title: 'Pages',
      url: ['pages'],
      icon: 'tuiIconFile',
      description: 'University pages content',
    },
    {
      title: 'Users',
      url: ['users'],
      icon: 'tuiIconUsers',
      description: 'Accounts & roles management',
    },
    {
      title: 'Keywords',
      url: ['keywords'],
      icon: 'tuiIconTag',
      description: '',
    },
    {
      title: 'Backups',
      url: ['backups'],
      icon: 'tuiIconPackage',
      description: 'System backup & restore',
    },
  ] as DashboardTile[]);
}
