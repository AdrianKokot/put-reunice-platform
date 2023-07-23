import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAppearance, tuiButtonOptionsProvider } from '@taiga-ui/core';
import { tuiAvatarOptionsProvider } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-ui-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
