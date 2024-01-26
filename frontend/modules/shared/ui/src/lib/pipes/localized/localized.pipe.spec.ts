import { LocalizedDatePipe } from './localized.pipe';
import { inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { LangService } from '@eunice/modules/shared/util';

describe(LocalizedDatePipe.name, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DatePipe, ChangeDetectorRef],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  it('create an instance', inject(
    [LangService, DatePipe, ChangeDetectorRef],
    (translate: LangService, datePipe: DatePipe, cdr: ChangeDetectorRef) => {
      const pipe = new LocalizedDatePipe(translate, datePipe, cdr);
      expect(pipe).toBeTruthy();
    },
  ));
});
