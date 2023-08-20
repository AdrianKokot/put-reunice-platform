import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resourceFromRoute } from '@reunice/modules/shared/util';
import { UniversityService } from '@reunice/modules/shared/data-access';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-university-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLabelModule,
    TuiLetModule,
    TranslateModule,
    TuiEditorSocketModule,
    RouterLink,
    TuiButtonModule,
  ],
  templateUrl: './university-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityDetailsComponent {
  readonly item$ = resourceFromRoute(inject(UniversityService));
}
