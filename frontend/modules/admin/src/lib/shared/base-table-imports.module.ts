import { NgModule } from '@angular/core';
import {
  TuiHintModule,
  TuiLoaderModule,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { TuiForModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { NgForTrackByIdDirective } from '@reunice/modules/shared/util';

const modules = [
  CommonModule,
  TuiLetModule,
  TuiTableModule,
  NgForTrackByIdDirective,
  TuiLoaderModule,
  TuiForModule,
  TuiTablePaginationModule,
  TuiScrollbarModule,
  TuiHintModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class BaseTableImportsModule {}
