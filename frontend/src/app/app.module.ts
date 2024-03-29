import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TUI_SANITIZER,
  TuiAlertModule,
  tuiButtonOptionsProvider,
  TuiDialogModule,
  tuiNotificationOptionsProvider,
  TuiRootModule,
} from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { UiModule } from '@eunice/modules/shared/ui';
import { TuiLanguageName, tuiLanguageSwitcher } from '@taiga-ui/i18n';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';

import '@angular/common/locales/global/pl';
import '@angular/common/locales/global/en-GB';
import { TuiPreviewModule } from '@taiga-ui/addon-preview';
import {
  TUI_HIDE_TEXT,
  TUI_SHOW_ALL_TEXT,
  TUI_VALIDATION_ERRORS,
} from '@taiga-ui/kit';

@NgModule({
  declarations: [RootComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: localStorage.getItem('locale') ?? 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
        deps: [HttpClient],
      },
    }),
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiPreviewModule,
    TuiLetModule,
    UiModule,
    PolymorpheusModule,
    TuiActiveZoneModule,
  ],
  providers: [
    tuiButtonOptionsProvider({ size: 'm' }),
    tuiLanguageSwitcher((language: TuiLanguageName): Promise<unknown> => {
      switch (language) {
        case 'polish':
          return import('@taiga-ui/i18n/languages/polish');

        default:
          return import('@taiga-ui/i18n/languages/english');
      }
    }),
    tuiNotificationOptionsProvider({
      autoClose: 2500,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: TUI_HIDE_TEXT,
      useFactory: (translate: TranslateService) => translate.get('HIDE'),
      deps: [TranslateService],
    },
    {
      provide: TUI_SHOW_ALL_TEXT,
      useFactory: (translate: TranslateService) => translate.get('SHOW_ALL'),
      deps: [TranslateService],
    },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: TUI_VALIDATION_ERRORS,
      deps: [TranslateService],
      useFactory: (translate: TranslateService) => ({
        required: () => translate.get('VALIDATION_ERROR_REQUIRED'),
        email: () => translate.get('VALIDATION_ERROR_EMAIL'),
        maxlength: (params: { requiredLength: number }) =>
          translate.get('VALIDATION_ERROR_MAXLENGTH', params),
      }),
    },
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
