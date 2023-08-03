import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  University,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import { TuiForModule, TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-university-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiLinkModule,
    RouterLink,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiButtonModule,
    TuiForModule,
    TuiLoaderModule,
  ],
  templateUrl: './university-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {
  private readonly _universityService = inject(UniversityService);

  readonly columns = ['name', 'shortName', 'hidden', 'actions'];

  readonly items$ = this._universityService.getUniversities();

  readonly trackById = (index: number, item: University) => item.id;
}
