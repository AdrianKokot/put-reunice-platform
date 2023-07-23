import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiHostedDropdownModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsersListComponent } from './user/users-list/users-list.component';
import { PageDetailsComponent } from './page/page-details/page-details.component';
import { PageListComponent } from './page/page-list/page-list.component';
import { UniversityListComponent } from './university/university-list/university-list.component';
import { UniversityDetailsComponent } from './university/university-details/university-details.component';
import { DialogUserCreateComponent } from './user/dialogs/dialog-user-create/dialog-user-create.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { DialogUniversityCreateComponent } from './university/dialog-university-create/dialog-university-create.component';
import { PageUserComponent } from './page/page-user/page-user.component';
import { MatButtonModule } from '@angular/material/button';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from './quill-editor/quill-editor.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageCardComponent } from './page/page-card/page-card.component';
import { DialogPageCreateComponent } from './page/dialog-page-create/dialog-page-create.component';
import { UserCardComponent } from './user/user-card/user-card.component';
import { UniversityCardComponent } from './university/university-card/university-card.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from './dialog/error-dialog/error-dialog.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { DialogUserEnrolledUniversitiesComponent } from './user/dialogs/dialog-user-enrolled-universities/dialog-user-enrolled-universities.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogPageCreatorComponent } from './page/dialog-page-creator/dialog-page-creator.component';
import { DialogUserChangePasswordComponent } from './user/dialogs/dialog-user-change-password/dialog-user-change-password.component';
import { SuccessDialogComponent } from './dialog/success-dialog/success-dialog.component';
import { DialogUserChangeUsernameComponent } from './user/dialogs/dialog-user-change-username/dialog-user-change-username.component';
import { DialogUserUpdateComponent } from './user/dialogs/dialog-user-update/dialog-user-update.component';
import { DialogUserChangeAccountTypeComponent } from './user/dialogs/dialog-user-change-account-type/dialog-user-change-account-type.component';
import { SetupService } from 'modules/shared/data-access/src/lib/services/setup.service';
import { SearchComponent } from './search/search.component';
import { TemplatesListComponent } from './templates/templates-list/templates-list.component';
import { MatListModule } from '@angular/material/list';
import { UniversitySelectorComponent } from './university/university-selector/university-selector.component';
import { DialogTemplateCreateComponent } from './templates/dialog-template-create/dialog-template-create.component';
import { PageEditorComponent } from './page/page-editor/page-editor.component';
import { TemplateEditorComponent } from './templates/template-editor/template-editor.component';
import { DialogTemplateChangeNameComponent } from './templates/dialog-template-change-name/dialog-template-change-name.component';
import { KeyWordsSelectorsComponent } from './keywords/key-words-selectors/key-words-selectors.component';
import { EditPageKeyWordsComponent } from './keywords/edit-page-key-words/edit-page-key-words.component';
import { KeywordsComponent } from './keywords/keywords/keywords.component';
import { DialogInputKeywordsComponent } from './keywords/dialog-input-keywords/dialog-input-keywords.component';
import { TemplateSelectorComponent } from './templates/template-selector/template-selector.component';
import { DialogTemplateLoadComponent } from './templates/dialog-template-load/dialog-template-load.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { FileCardComponent } from './file-card/file-card.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BackupComponent } from './backup/backup.component';
import { MatTableModule } from '@angular/material/table';
import { DialogPageEditBasicComponent } from './page/dialog-page-edit-basic/dialog-page-edit-basic.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { UiModule } from '@reunice/modules/shared/ui';
import { AuthService } from '@reunice/modules/shared/security';
import {
  TuiDataListWrapperModule,
  TuiMultiSelectModule,
  TuiSelectModule,
} from '@taiga-ui/kit';

export function SetupApp(setup: SetupService) {
  return () => setup.initialize();
}

@NgModule({
  declarations: [
    RootComponent,
    MainPageComponent,
    TopBarComponent,
    UserDetailsComponent,
    UsersListComponent,
    PageDetailsComponent,
    PageListComponent,
    UniversityListComponent,
    UniversityDetailsComponent,
    DialogUserCreateComponent,
    LoginComponent,
    UserProfileComponent,
    DialogUniversityCreateComponent,
    PageUserComponent,
    QuillEditorComponent,
    PageCardComponent,
    DialogPageCreateComponent,
    UserCardComponent,
    UniversityCardComponent,
    ConfirmationDialogComponent,
    ErrorDialogComponent,
    SpinnerComponent,
    DialogUserEnrolledUniversitiesComponent,
    DialogPageCreatorComponent,
    DialogUserChangePasswordComponent,
    SuccessDialogComponent,
    DialogUserChangeUsernameComponent,
    DialogUserUpdateComponent,
    DialogUserChangeAccountTypeComponent,
    SearchComponent,
    TemplatesListComponent,
    UniversitySelectorComponent,
    DialogTemplateCreateComponent,
    PageEditorComponent,
    TemplateEditorComponent,
    DialogTemplateChangeNameComponent,
    TemplateSelectorComponent,
    DialogTemplateLoadComponent,
    KeyWordsSelectorsComponent,
    FileCardComponent,
    EditPageKeyWordsComponent,
    KeywordsComponent,
    DialogInputKeywordsComponent,
    BackupComponent,
    DialogPageEditBasicComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSidenavModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    AgGridModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatChipsModule,
    MatTableModule,
    QuillModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatDividerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatListModule,
    MatGridListModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
    MatTreeModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    UiModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiMultiSelectModule,
  ],
  providers: [
    // SetupService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (service: AuthService) => () => service.user$,
    //   deps: [AuthService],
    //   multi: true
    // },
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

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
