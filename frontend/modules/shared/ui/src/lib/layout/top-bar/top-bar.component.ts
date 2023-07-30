import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserDirective } from '@reunice/modules/shared/security';
import {
  TuiAppearance,
  TuiButtonModule,
  TuiDataListModule,
  TuiFlagPipeModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  tuiButtonOptionsProvider,
} from '@taiga-ui/core';
import { TuiAvatarModule, tuiAvatarOptionsProvider } from '@taiga-ui/kit';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';

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
    TuiFlagPipeModule,
    LanguageSwitcherComponent,
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
