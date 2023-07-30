import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiFlagPipeModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiCountryIsoCode, TuiLanguageName } from '@taiga-ui/i18n';
import { TuiSelectModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiDataListModule,
    FormsModule,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiFlagPipeModule,
    TuiTextfieldControllerModule,
  ],
})
export class LanguageSwitcherComponent {
  readonly translateService = inject(TranslateService);

  readonly language = new FormControl(this.translateService.defaultLang);

  readonly flags = new Map<TuiLanguageName, TuiCountryIsoCode>([
    ['pl', TuiCountryIsoCode.PL],
    ['en', TuiCountryIsoCode.GB],
  ]);

  readonly names: TuiLanguageName[] = Array.from(this.flags.keys());

  constructor() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem('locale', event.lang);
    });
  }
}
