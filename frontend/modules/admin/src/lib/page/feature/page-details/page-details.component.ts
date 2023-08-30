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
import { resourceIdFromRoute } from '@reunice/modules/shared/util';
import {
  FileService,
  Page,
  PageService,
} from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiFilesModule, TuiIslandModule, TuiTreeModule } from '@taiga-ui/kit';
import { filter, shareReplay, startWith, switchMap } from 'rxjs';
import { LocalizedPipeModule } from '@reunice/modules/shared/ui';

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
    LocalizedPipeModule,
  ],
  templateUrl: './page-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageDetailsComponent {
  private readonly _service = inject(PageService);
  private readonly _fileService = inject(FileService);

  private readonly _id$ = resourceIdFromRoute();

  readonly item$ = this._id$.pipe(
    switchMap((id) => this._service.get(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly pagesTree$ = this.item$.pipe(
    filter((page): page is Page => page !== null),
    switchMap((page) =>
      this._service
        .getUniversityHierarchy(page.university.id)
        .pipe(startWith(null)),
    ),
    shareReplay(),
  );

  readonly files$ = this._id$.pipe(
    switchMap((id) => this._fileService.getAll(id).pipe(startWith(null))),
    shareReplay(),
  );

  readonly pagesTreeHandler: TuiHandler<Page, readonly Page[]> = (item) =>
    item?.children ?? [];
}
