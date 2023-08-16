import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {
  defaultEditorExtensions,
  TUI_EDITOR_EXTENSIONS,
} from '@tinkoff/tui-editor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientTestingModule,
    RouterTestingModule,
    NoopAnimationsModule,
    TranslateModule.forRoot(),
  ],
  providers: [
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: defaultEditorExtensions,
    },
  ],
})
export class TestingModule {}
