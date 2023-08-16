import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService, PageService } from '@reunice/modules/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { filter, map, share, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _pageService = inject(PageService);
  private readonly _fileService = inject(FileService);

  private readonly _pageId$ = inject(ActivatedRoute).paramMap.pipe(
    map((params) => params.get('pageId')),
    filter((id): id is string => id !== null),
    map((id) => parseInt(id)),
    share()
  );

  readonly page$ = this._pageId$.pipe(
    switchMap((id) => this._pageService.get(id).pipe(startWith(null)))
  );

  readonly files$ = this._pageId$.pipe(
    switchMap((id) => this._fileService.getAll(id).pipe(startWith(null)))
  );
}
