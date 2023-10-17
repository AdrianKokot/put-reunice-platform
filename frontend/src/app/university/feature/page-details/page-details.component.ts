import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { startWith, switchMap } from 'rxjs';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiBreadcrumbsModule, TuiLineClampModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintModule, TuiLinkModule } from '@taiga-ui/core';
import { resourceIdFromRoute } from '@reunice/modules/shared/util';
import { PageFilesListComponent } from '../page-files-list/page-files-list.component';
import { UserControlsResourceDirective } from '@reunice/modules/shared/security';
import { TranslateModule } from '@ngx-translate/core';

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
    PageFilesListComponent,
    TuiButtonModule,
    RouterLink,
    UserControlsResourceDirective,
    TuiHintModule,
    TranslateModule,
  ],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _pageService = inject(PageService);

  private readonly _pageId$ = resourceIdFromRoute('pageId');

  readonly page$ = this._pageId$.pipe(
    switchMap((id) => this._pageService.get(id).pipe(startWith(null))),
  );
}
