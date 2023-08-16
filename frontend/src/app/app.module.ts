import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TUI_SANITIZER,
  TuiAlertModule,
  tuiButtonOptionsProvider,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
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
import { UiModule } from '@reunice/modules/shared/ui';
import { TuiLanguageName, tuiLanguageSwitcher } from '@taiga-ui/i18n';

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
    UiModule,
  ],
  providers: [
    tuiButtonOptionsProvider({ size: 'm' }),
    tuiLanguageSwitcher(async (language: TuiLanguageName): Promise<unknown> => {
      switch (language) {
        case 'polish':
          return import('@taiga-ui/i18n/languages/polish');

        default:
          return import('@taiga-ui/i18n/languages/english');
      }
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
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
