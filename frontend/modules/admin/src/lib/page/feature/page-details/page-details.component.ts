import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
} from '@taiga-ui/core';
import { TuiHandler, TuiLetModule } from '@taiga-ui/cdk';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import {
  resourceFromRoute,
  resourceIdFromRoute,
} from '@reunice/modules/shared/util';
import {
  FileService,
  Page,
  PageService,
} from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiFilesModule, TuiIslandModule, TuiTreeModule } from '@taiga-ui/kit';
import { filter, shareReplay, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'reunice-page-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    TuiLetModule,
    TuiButtonModule,
    TuiEditorSocketModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TuiIslandModule,
    TuiTreeModule,
    TuiErrorModule,
    TuiFilesModule,
  ],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _service = inject(PageService);
  private readonly _fileService = inject(FileService);
  readonly item$ = resourceFromRoute(this._service);

  readonly pagesTree$ = this.item$.pipe(
    filter((page): page is Page => page !== null),
    switchMap((page) =>
      this._service
        .getUniversityHierarchy(page.university.id)
        .pipe(startWith(null)),
    ),
    shareReplay(),
  );

  readonly files$ = resourceIdFromRoute().pipe(
    switchMap((id) => this._fileService.getAll(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly pagesTreeHandler: TuiHandler<Page, readonly Page[]> = (item) =>
    item?.children ?? [];
}
