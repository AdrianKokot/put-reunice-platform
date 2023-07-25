import { Component, EventEmitter, Input, Output } from '@angular/core';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';
import { Params } from '@angular/router';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'reunice-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
})
export class QuillEditorComponent {
  @Input() title = 'Editing';
  @Input() subtitle?: string = 'Title';
  @Input() content?: string;
  @Input() onCloseLink?: string | null | (string | number)[] = ['/'];
  @Input() onCloseLinkParams?: Params | undefined;
  @Output() saved = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();

  modules = {};

  constructor() {
    this.modules = {
      imageResize: {},
    };
  }

  created(quill: Quill) {
    if (this.content) {
      quill.clipboard.dangerouslyPasteHTML(this.content);
    }
  }

  save() {
    if (this.content) {
      this.saved.emit(this.content);
    }
  }

  onContentChanged(content: string) {
    this.contentChange.emit(content);
    this.content = content;
  }
}
