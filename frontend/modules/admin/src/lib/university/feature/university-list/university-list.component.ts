import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';

@Component({
  selector: 'reunice-university-list',
  standalone: true,
  imports: [CommonModule, TuiLetModule, TuiTableModule],
  templateUrl: './university-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {
  private readonly _universityService = inject(UniversityService);

  readonly columns = ['name', 'shortName', 'hidden'];

  readonly universities$ = this._universityService.getUniversities();
}
