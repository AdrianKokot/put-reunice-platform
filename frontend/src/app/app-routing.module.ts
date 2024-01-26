import { Injectable, NgModule } from '@angular/core';
import {
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { AuthModule } from '@eunice/modules/auth';
import { UniversityModule } from './university/university.module';
import { AuthGuard } from '@eunice/modules/shared/security';
import { PageModule } from './page/page.module';

@Injectable({ providedIn: 'root' })
class euniceTitleStrategy extends DefaultTitleStrategy {
  override updateTitle(snapshot: RouterStateSnapshot) {
    const title = this.buildTitle(snapshot);
    if (title !== undefined) {
      this.title.setTitle(`Eunice | ${title}`);
    } else {
      this.title.setTitle('Eunice');
    }
  }
}

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@eunice/modules/admin').then((m) => m.AdminModule),
    canMatch: [AuthGuard],
  },
  {
    path: 'authors',
    loadChildren: () =>
      import('./author/author.module').then((m) => m.AuthorModule),
  },
  {
    loadChildren: () => AuthModule,
    path: 'auth',
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canMatch: [AuthGuard],
  },
  {
    path: 'tickets/:id',
    loadChildren: () =>
      import('./ticket/ticket.module').then((m) => m.TicketModule),
  },
  {
    path: '',
    loadChildren: () => PageModule,
  },
  {
    path: '',
    loadChildren: () => UniversityModule,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
    }),
  ],
  providers: [
    {
      provide: TitleStrategy,
      useClass: euniceTitleStrategy,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
