import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalizedDatePipe } from './localized.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [TranslateModule],
  providers: [DatePipe],
  declarations: [LocalizedDatePipe],
  exports: [LocalizedDatePipe],
})
export class LocalizedPipeModule {}
