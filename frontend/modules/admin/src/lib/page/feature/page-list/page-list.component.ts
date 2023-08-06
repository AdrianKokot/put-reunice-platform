import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiFormatDatePipeModule, TuiLinkModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-page-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiFormatDatePipeModule,
    RouterLink,
    TuiLinkModule,
  ],
  templateUrl: './page-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageListComponent {
  private readonly _pageService = inject(PageService);

  readonly columns = [
    'title',
    'createdAt',
    'university',
    'author',
    'hidden',
    'actions',
  ];

  readonly pages$ = this._pageService.getAll();
}
