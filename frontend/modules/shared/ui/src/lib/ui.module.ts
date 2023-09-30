import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { SearchComponent } from './layout/search/search.component';

@NgModule({
  imports: [CommonModule, TopBarComponent, SidebarComponent, SearchComponent],
  declarations: [],
  exports: [TopBarComponent, SidebarComponent, SearchComponent],
})
export class UiModule {}
