import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService, PageService } from '@reunice/modules/shared/data-access';
import { RouterLinkActive } from '@angular/router';
import { startWith, switchMap } from 'rxjs';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBreadcrumbsModule, TuiLineClampModule } from '@taiga-ui/kit';
import { TuiLinkModule } from '@taiga-ui/core';
import { resourceIdFromRoute } from '@reunice/modules/shared/util';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiEditorSocketModule,
    TuiLetModule,
    RouterLinkActive,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiLineClampModule,
  ],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _fileService = inject(FileService);
  private readonly _pageService = inject(PageService);

  private readonly _pageId$ = resourceIdFromRoute('pageId');

  readonly page$ = this._pageId$.pipe(
    switchMap((id) => this._pageService.get(id).pipe(startWith(null)))
  );

  readonly files$ = this._pageId$.pipe(
    switchMap((id) => this._fileService.getAll(id).pipe(startWith(null)))
  );
}
