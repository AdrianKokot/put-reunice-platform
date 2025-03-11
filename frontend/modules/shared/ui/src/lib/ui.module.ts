import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SearchComponent } from './layout/search/search.component';
import { FooterComponent } from './layout/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    TopBarComponent,
    SidebarComponent,
    SearchComponent,
    FooterComponent,
  ],
  declarations: [],
  exports: [
    TopBarComponent,
    SidebarComponent,
    SearchComponent,
    FooterComponent,
  ],
})
export class UiModule {}
