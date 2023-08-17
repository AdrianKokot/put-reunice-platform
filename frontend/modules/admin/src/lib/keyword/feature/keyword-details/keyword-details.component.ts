import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-keyword-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyword-details.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordDetailsComponent {}
