import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TuiAppearance,
  TuiButtonModule,
  tuiButtonOptionsProvider,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, tuiAvatarOptionsProvider } from '@taiga-ui/kit';
import { UserDirective } from '@reunice/modules/shared/security';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'reunice-ui-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    UserDirective,
    TuiButtonModule,
    RouterLink,
    TuiHostedDropdownModule,
    TuiAvatarModule,
    TuiDataListModule,
    TuiLinkModule,
  ],
  providers: [
    tuiButtonOptionsProvider({
      size: 's',
      shape: 'rounded',
      appearance: TuiAppearance.Flat,
    }),
    tuiAvatarOptionsProvider({ size: 's', rounded: true, autoColor: true }),
  ],
})
export class TopBarComponent {}
