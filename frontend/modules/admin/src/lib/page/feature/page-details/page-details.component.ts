import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-details.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {}
