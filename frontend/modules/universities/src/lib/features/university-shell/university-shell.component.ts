import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Page,
  PageService,
  UniversityService,
} from '@reunice/modules/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs';
import { TuiHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-university-shell',
  templateUrl: './university-shell.component.html',
  styles: [],
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
    switchMap((id) =>
      this._universityService.getUniversity(id).pipe(startWith(null))
    )
  );

  public readonly pages$ = this._universityId$.pipe(
    switchMap((id) =>
      this._pageService.getUniversityHierarchy(id).pipe(startWith(null))
    )
  );

  readonly handler: TuiHandler<Page, readonly Page[]> = (item) => item.children;
}
