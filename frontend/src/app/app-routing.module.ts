import { Injectable, NgModule } from '@angular/core';
import {
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { AuthModule } from '@reunice/modules/auth';
import { UniversityModule } from './university/university.module';
import { AuthGuard } from '@reunice/modules/shared/security';

@Injectable({ providedIn: 'root' })
class ReuniceTitleStrategy extends DefaultTitleStrategy {
  override updateTitle(snapshot: RouterStateSnapshot) {
    const title = this.buildTitle(snapshot);
    if (title !== undefined) {
      this.title.setTitle(`Reunice | ${title}`);
    }
  }
}

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@reunice/modules/admin').then((m) => m.AdminModule),
    canMatch: [AuthGuard],
  },
  {
    path: 'universities',
    loadChildren: () => UniversityModule,
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
    redirectTo: 'universities',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    {
      provide: TitleStrategy,
      useClass: ReuniceTitleStrategy,
    },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
