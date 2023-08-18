import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { resourceFromRoute } from '@reunice/modules/shared/util';
import { KeyWordsService } from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-keyword-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    TuiLetModule,
    TuiButtonModule,
    RouterLink,
  ],
  templateUrl: './keyword-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeywordDetailsComponent {
  readonly item$ = resourceFromRoute(inject(KeyWordsService));
}
