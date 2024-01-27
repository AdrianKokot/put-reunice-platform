import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserDirective } from '@eunice/modules/shared/security';
import {
  TuiAppearance,
  TuiButtonModule,
  tuiButtonOptionsProvider,
  TuiDataListModule,
  TuiFlagPipeModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, tuiAvatarOptionsProvider } from '@taiga-ui/kit';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'eunice-ui-top-bar',
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
    TranslateModule,
    LanguageSwitcherComponent,
    NotificationsComponent,
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
