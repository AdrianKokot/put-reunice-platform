import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './lib.routes';
import {
  defaultEditorExtensions,
  TUI_EDITOR_EXTENSIONS,
} from '@tinkoff/tui-editor';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(adminRoutes)],
  providers: [
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: defaultEditorExtensions,
    },
  ],
})
export class AdminModule {}
