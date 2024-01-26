import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@eunice/modules/shared/data-access';
import { LocalizedPipeModule } from '@eunice/modules/shared/ui';
import { NgForTrackByIdDirective } from '@eunice/modules/shared/util';
import { TranslateModule } from '@ngx-translate/core';
import { TuiLabelModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';

@Component({
  selector: 'eunice-user-basic-information',
  standalone: true,
  imports: [
    CommonModule,
    LocalizedPipeModule,
    NgForTrackByIdDirective,
    TranslateModule,
    TuiLabelModule,
    TuiTagModule,
  ],
  templateUrl: './user-basic-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBasicInformationComponent {
  @Input() user: User | null = null;
}
