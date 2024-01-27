import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListModule,
  TuiFlagPipeModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { TuiLanguageSwitcher } from '@taiga-ui/i18n';
import { LOCALE_FLAGS, localeToTuiLanguage } from '@eunice/modules/shared/util';
import { Router } from '@angular/router';

@Component({
  selector: 'eunice-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    TuiDataListModule,
    TuiFlagPipeModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly flags = LOCALE_FLAGS;
  readonly language = new FormControl(this.translateService.defaultLang);

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(LOCAL_STORAGE) localStorage: Storage,
    @Inject(TuiLanguageSwitcher) switcher: TuiLanguageSwitcher,
    readonly translateService: TranslateService,
    router: Router,
  ) {
    let firstLoad = true;
    this.translateService.onDefaultLangChange.subscribe(
      ({ lang }: LangChangeEvent) => {
        document.documentElement.lang = lang;
        localStorage.setItem('locale', lang);
        switcher.setLanguage(localeToTuiLanguage(lang));

        if (firstLoad) {
          firstLoad = false;
          return;
        }

        const url = router.url;

        router
          .navigate(['/'])
          .then(() => router.navigate([url]))
          .then();
      },
    );
  }
}
