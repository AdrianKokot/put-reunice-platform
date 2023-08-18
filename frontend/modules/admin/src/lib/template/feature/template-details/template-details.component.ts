import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgForTrackByIdDirective,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { TemplateService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TuiEditorSocketModule } from '@tinkoff/tui-editor';
import { RouterLink } from '@angular/router';
import { UserDirective } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-template-details',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiLabelModule,
    TranslateModule,
    TuiTagModule,
    TuiEditorSocketModule,
    RouterLink,
    TuiButtonModule,
    UserDirective,
    NgForTrackByIdDirective,
  ],
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDetailsComponent {
  readonly item$ = resourceFromRoute(inject(TemplateService));
}
