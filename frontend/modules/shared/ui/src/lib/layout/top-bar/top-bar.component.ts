import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  TuiAppearance,
  TuiButtonModule,
  tuiButtonOptionsProvider,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, tuiAvatarOptionsProvider } from '@taiga-ui/kit';
import { UserDirective } from '@reunice/modules/shared/security';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiFlagPipeModule } from '@taiga-ui/core';
import { TuiCountryIsoCode, TuiLanguageName } from '@taiga-ui/i18n';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-ui-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    UserDirective,
    TuiButtonModule,
    RouterLink,
    TuiHostedDropdownModule,
    TuiAvatarModule,
    TuiDataListModule,
    TuiLinkModule,
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiSelectModule,
    TuiFlagPipeModule,
    TuiTextfieldControllerModule,
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
export class TopBarComponent {
  readonly translateService = inject(TranslateService);

  readonly language = new FormControl(this.translateService.defaultLang);

  readonly flags = new Map<TuiLanguageName, TuiCountryIsoCode>([
    ['pl', TuiCountryIsoCode.PL],
    ['en', TuiCountryIsoCode.GB],
  ]);

  readonly names: TuiLanguageName[] = Array.from(this.flags.keys());
}
