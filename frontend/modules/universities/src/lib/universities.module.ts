import { TuiIslandModule, TuiTreeModule } from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';
import { TuiForModule, TuiLetModule } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';
import { universitiesRoutes } from './lib.routes';
import { UniversityShellComponent } from './features/university-shell/university-shell.component';
import { TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { UniversityListComponent } from './features/university-list/university-list.component';
import { PageDetailsComponent } from './features/page-details/page-details.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(universitiesRoutes),
    TuiIslandModule,
    TuiLetModule,
    TuiLoaderModule,
    TuiForModule,
    TuiTreeModule,
    TuiLinkModule,
    TranslateModule,
  ],
  declarations: [
    UniversityListComponent,
    UniversityListComponent,
    UniversityShellComponent,
    PageDetailsComponent,
  ],
})
export class UniversitiesModule {}
