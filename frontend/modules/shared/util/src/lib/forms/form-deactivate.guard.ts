import { CanDeactivateFn } from '@angular/router';
import { AbstractControl, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { TuiDialogService } from '@taiga-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { DEACTIVATE_FORM } from '../tokens/deactivate-form.token';
import { of } from 'rxjs';

type OnlyAbstractControlKeys<T> = {
  [K in keyof T]: T[K] extends FormGroup ? K : never;
}[keyof T];

export const DeactivateFormGuard =
  <T>(formProperty: OnlyAbstractControlKeys<T>): CanDeactivateFn<T> =>
  (component: T) => {
    const dialog = inject(TuiDialogService);
    const translate = inject(TranslateService);
    const { label, size, promptContent, confirmText, cancelText } =
      inject(DEACTIVATE_FORM);
    const control = component[formProperty] as AbstractControl;

    if (control.pristine || control.disabled) return of(true);

    return dialog.open<boolean>(TUI_PROMPT, {
      label: label ? translate.instant(label) : label,
      size: size ? size : 's',
      data: {
        content:
          typeof promptContent === 'string' && promptContent
            ? translate.instant(promptContent)
            : promptContent,
        yes: translate.instant(confirmText),
        no: translate.instant(cancelText),
      },
      dismissible: false,
      closeable: false,
    });
  };
