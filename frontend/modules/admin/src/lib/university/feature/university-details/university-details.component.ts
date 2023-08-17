import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-university-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './university-details.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityDetailsComponent {}
