import { Component, Input } from '@angular/core';
import { University } from '@reunice/modules/shared/data-access';

@Component({
  selector: 'reunice-university-card',
  templateUrl: './university-card.component.html',
  styleUrls: ['./university-card.component.scss'],
})
export class UniversityCardComponent {
  @Input() university?: University;
  @Input() config: UniversityCardConfig = {} as UniversityCardConfig;
}

export interface UniversityCardConfig {
  useSecondaryColor: boolean;
  showDescription: boolean;
  showLink: boolean;
}
