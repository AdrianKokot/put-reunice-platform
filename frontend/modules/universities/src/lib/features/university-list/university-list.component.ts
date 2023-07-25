import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageService } from '@reunice/modules/shared/data-access';
import { startWith } from 'rxjs';

@Component({
  selector: 'reunice-university-list',
  templateUrl: './university-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {
  universities$ = inject(PageService).getMainPages().pipe(startWith(null));
}
