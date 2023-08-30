import {
  Directive,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { TuiDialogService, TuiDialogSize } from '@taiga-ui/core';
import { takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TranslateService } from '@ngx-translate/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Directive({
  selector: '[reuniceConfirm]',
  standalone: true,
  providers: [TuiDestroyService],
})
export class ConfirmDirective {
  private readonly _dialog = inject(TuiDialogService);
  private readonly _destroy$ = inject(TuiDestroyService);
  private readonly _translate = inject(TranslateService);

  @Input('reuniceConfirm')
  promptContent: PolymorpheusContent = '';

  @Input()
  confirmText: string = 'CONFIRM';

  @Input()
  cancelText: string = 'CANCEL';

  @Input()
  size: TuiDialogSize = 's';

  @Input()
  label: string | undefined = 'ARE_YOU_SURE';

  @Output()
  readonly confirm = new EventEmitter<void>();

  @Output()
  readonly cancel = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this._dialog
      .open<boolean>(TUI_PROMPT, {
        label: this.label ? this._translate.instant(this.label) : this.label,
        size: this.size,
        data: {
          content:
            typeof this.promptContent === 'string' && this.promptContent
              ? this._translate.instant(this.promptContent)
              : this.promptContent,
          yes: this._translate.instant(this.confirmText),
          no: this._translate.instant(this.cancelText),
        },
      })
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {
        if (response) {
          this.confirm.emit();
        } else {
          this.cancel.emit();
        }
      });
  }
}
