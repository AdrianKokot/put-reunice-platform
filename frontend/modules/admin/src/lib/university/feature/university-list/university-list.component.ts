import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLinkModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-university-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiLinkModule,
    RouterLink,
  ],
  templateUrl: './university-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {
  private readonly _universityService = inject(UniversityService);

  readonly columns = ['name', 'shortName', 'hidden', 'actions'];

  readonly universities$ = this._universityService.getUniversities();
}
