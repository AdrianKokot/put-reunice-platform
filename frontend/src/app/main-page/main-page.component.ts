import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageService } from '@reunice/modules/shared/data-access';
import { delay, startWith } from 'rxjs';

@Component({
  selector: 'reunice-main-page',
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  universities$ = inject(PageService)
    .getMainPages()
    .pipe(delay(1), startWith(null));
}
