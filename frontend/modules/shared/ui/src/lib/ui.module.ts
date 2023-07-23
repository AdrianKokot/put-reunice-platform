import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
} from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { UserDirective } from '@reunice/modules/shared/security';
import { TuiAvatarModule } from '@taiga-ui/kit';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiAvatarModule,
    UserDirective,
  ],
  declarations: [TopBarComponent],
  exports: [TopBarComponent],
})
export class UiModule {}
