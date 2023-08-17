import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  NgForTrackByIdDirective,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { UserService } from '@reunice/modules/shared/data-access';
import { RouterLink } from '@angular/router';
import { TuiTagModule } from '@taiga-ui/kit';
import { UserDirective } from '@reunice/modules/shared/security';

@Component({
  selector: 'reunice-user-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    TuiLetModule,
    TuiButtonModule,
    RouterLink,
    NgForTrackByIdDirective,
    TuiTagModule,
    UserDirective,
  ],
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent {
  readonly item$ = resourceFromRoute(inject(UserService));
}
