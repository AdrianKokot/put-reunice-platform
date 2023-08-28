import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@NgModule({
  imports: [CommonModule, TopBarComponent, SidebarComponent],
  declarations: [],
  exports: [TopBarComponent, SidebarComponent],
})
export class UiModule {}
