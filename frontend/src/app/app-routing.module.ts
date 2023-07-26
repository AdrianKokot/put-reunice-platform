import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogUserCreateComponent } from './user/dialogs/dialog-user-create/dialog-user-create.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { PageEditorComponent } from './page/page-editor/page-editor.component';
import { PageUserComponent } from './page/page-user/page-user.component';
import { TemplateEditorComponent } from './templates/template-editor/template-editor.component';
import { BackupComponent } from './backup/backup.component';
import { SearchComponent } from './search/search.component';
import { KeywordsComponent } from './keywords/keywords/keywords.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@reunice/modules/admin').then((m) => m.AdminModule),
  },
  { path: '', redirectTo: 'universities', pathMatch: 'full' },
  // { path: "", component: MainPageComponent, title: "Strona główna" },
  {
    path: 'universities',
    loadChildren: () =>
      import('@reunice/modules/universities').then((m) => m.UniversitiesModule),
  },
  {
    path: 'accounts/create',
    component: DialogUserCreateComponent,
    title: 'Stwórz użytkownika',
  },
  {
    path: 'accounts/profile',
    component: UserProfileComponent,
    title: 'Profil',
  },
  {
    path: 'account/:userId',
    component: UserDetailsComponent,
    title: 'Szczegóły użytkownika',
  },
  {
    path: 'page/:pageId/edit',
    component: PageEditorComponent,
    title: 'Edycja strony',
  },
  { path: 'pages/:userId', component: PageUserComponent },
  {
    path: 'template/:templateId/edit',
    component: TemplateEditorComponent,
    title: 'Edycja szablonu',
  },
  { path: 'backups', component: BackupComponent, title: 'Kopie zapasowe' },
  { path: 'search', component: SearchComponent, title: 'Search' },
  { path: 'keywords', component: KeywordsComponent, title: 'Keywords' },
  {
    loadChildren: () =>
      import('@reunice/modules/auth').then((m) => m.AuthModule),
    path: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
