import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Page,
  PageService,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs';
import { TuiHandler } from '@taiga-ui/cdk';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiTreeModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-university-shell',
  standalone: true,
  imports: [
    CommonModule,
    TuiLinkModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TuiTreeModule,
  ],
  templateUrl: './university-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityShellComponent {
  private readonly _universityService = inject(UniversityService);
  private readonly _pageService = inject(PageService);

  private readonly _universityId$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => id !== null),
    map((id) => parseInt(id))
  );

  public readonly university$ = this._universityId$.pipe(
    switchMap((id) => this._universityService.get(id).pipe(startWith(null)))
  );

  public readonly pages$ = this._universityId$.pipe(
    switchMap((id) =>
      this._pageService.getUniversityHierarchy(id).pipe(startWith(null))
    )
  );

  readonly handler: TuiHandler<Page, readonly Page[]> = (item) => item.children;
}
