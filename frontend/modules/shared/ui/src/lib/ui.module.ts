import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './layout/top-bar/top-bar.component';

@NgModule({
  imports: [CommonModule, TopBarComponent],
  declarations: [],
  exports: [TopBarComponent],
})
export class UiModule {}
