import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiFormatDatePipeModule, TuiLinkModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-keyword-list',
  templateUrl: './keyword-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiFormatDatePipeModule,
    RouterLink,
    TuiLinkModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordListComponent {
  private readonly _keywordService = inject(KeyWordsService);

  readonly columns = ['word', 'actions'];

  readonly keywords$ = this._keywordService.getAll();
}
