import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import { startWith } from 'rxjs';
import { TuiIslandModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiForModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'reunice-university-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    RouterLink,
    TuiLoaderModule,
    TuiForModule,
    TranslateModule,
  ],
  templateUrl: './university-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {
  universities$ = inject(PageService).getMainPages().pipe(startWith(null));
}
