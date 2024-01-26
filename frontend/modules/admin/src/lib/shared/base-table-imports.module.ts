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
import { NgForTrackByIdDirective } from '@eunice/modules/shared/util';
import { TableFilterComponent } from './table/table-filter/table-filter.component';
import { LocalizedPipeModule } from '@eunice/modules/shared/ui';

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
  TableFilterComponent,
  LocalizedPipeModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class BaseTableImportsModule {}
