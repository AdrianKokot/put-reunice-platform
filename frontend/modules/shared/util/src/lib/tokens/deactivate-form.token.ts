import { InjectionToken, Provider } from '@angular/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogSize } from '@taiga-ui/core';

export interface DeactivateFormSettings {
  promptContent: PolymorpheusContent | null;
  confirmText: string;
  cancelText: string;
  size: TuiDialogSize;
  label: string | undefined;
}

export const DEACTIVATE_FORM = new InjectionToken<DeactivateFormSettings>(
  'DEACTIVATE_FORM',
);

const defaultDeactivateFormSettings: DeactivateFormSettings = {
  label: 'UNSAVED_CHANGES',
  size: 's',
  cancelText: 'CANCEL',
  confirmText: 'DISCARD',
  promptContent: 'DISCARD_FORM_CHANGES_DESCRIPTION',
};

export const provideDeactivateForm = (
  settings: Partial<DeactivateFormSettings> = {},
): Provider => ({
  provide: DEACTIVATE_FORM,
  useValue: {
    ...defaultDeactivateFormSettings,
    ...settings,
  },
});
