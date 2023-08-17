import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-template-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-details.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsComponent {}
