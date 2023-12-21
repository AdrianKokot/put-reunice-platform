import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { adminRoutes } from './lib.routes';
import {
  defaultEditorExtensions,
  TUI_EDITOR_EXTENSIONS,
} from '@tinkoff/tui-editor';
import { provideDeactivateForm } from '@reunice/modules/shared/util';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(adminRoutes)],
  providers: [
    provideDeactivateForm(),
    {
      provide: TUI_EDITOR_EXTENSIONS,
      useValue: [
        ...defaultEditorExtensions,
        import(
          './shared/editor-extensions/load-template/load-template.extension'
        ).then((m) => m.LoadTemplateExtension),
      ],
    },
  ],
})
export class AdminModule {}
