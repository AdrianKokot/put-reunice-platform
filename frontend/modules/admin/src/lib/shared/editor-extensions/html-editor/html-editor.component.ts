import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiErrorModule,
  TuiHintModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TuiTiptapEditorService } from '@tinkoff/tui-editor';
import { TuiFieldErrorPipeModule, TuiTextAreaModule } from '@taiga-ui/kit';

@Component({
  selector: 'eunice-html-editor-tool',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiButtonModule,
    TuiHintModule,
    TuiDialogModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLabelModule,
    TuiTextAreaModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './html-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 't-tool t-tool_margin t-tool__html-editor',
  },
  styleUrls: ['./html-editor.component.less'],
})
export class HtmlEditorComponent {
  private readonly _editor = inject(TuiTiptapEditorService);
  protected open = false;

  readonly form = inject(FormBuilder).nonNullable.group({
    content: [''],
  });

  openDialog() {
    const content = this._editor.getOriginTiptapEditor().getHTML();
    this.form.patchValue({ content });

    this.open = true;
  }

  submit(): void {
    this._editor
      .getOriginTiptapEditor()
      .chain()
      .setContent(this.form.controls.content.value, true, {
        preserveWhitespace: false,
      })
      .run();

    this.open = false;
  }
}
