import { NgModule } from '@angular/core';
import { TuiButtonModule, TuiHintModule, TuiLabelModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { NgForTrackByIdDirective } from '@reunice/modules/shared/util';
import {
  ConfirmDirective,
  LocalizedPipeModule,
} from '@reunice/modules/shared/ui';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {
  UserControlsResourceDirective,
  UserDirective,
} from '@reunice/modules/shared/security';

const modules = [
  CommonModule,
  TuiLetModule,
  TuiTableModule,
  TranslateModule,
  TuiLabelModule,
  TuiLetModule,
  TuiButtonModule,
  TuiHintModule,
  RouterModule,
  NgForTrackByIdDirective,
  UserDirective,
  ConfirmDirective,
  UserControlsResourceDirective,
  LocalizedPipeModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class BaseDetailsImportsModule {}
