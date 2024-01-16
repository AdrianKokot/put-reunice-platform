import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GlobalPageService } from '@reunice/modules/shared/data-access';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { TuiComboBoxModule, TuiDataListWrapperModule } from '@taiga-ui/kit';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import {
  ConfirmDirective,
  LocalizedPipeModule,
} from '@reunice/modules/shared/ui';
import { HtmlEditorComponent } from '../../../shared/editor-extensions/html-editor/html-editor.component';
import { TuiItemModule } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-global-page-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiEditorModule,
    LocalizedPipeModule,
    TuiDataListWrapperModule,
    ConfirmDirective,
    TuiComboBoxModule,
    HtmlEditorComponent,
    TuiItemModule,
  ],
  templateUrl: './global-page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalPageEditFormComponent {
  private readonly _service = inject(GlobalPageService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    content: ['', [Validators.required]],
    hidden: [true, [Validators.required]],
  });

  readonly item$ = resourceFromRoute(this._service, (item) =>
    this.form.patchValue(item),
  );

  readonly confirmText$ = combineLatest([
    this.item$,
    this.form.controls.hidden.valueChanges,
  ]).pipe(
    map(([item, hidden]) => {
      if (item?.hidden === hidden) return null;

      return hidden
        ? 'PAGE_VISIBILITY_CHANGE_TO_HIDDEN_CONFIRMATION'
        : 'PAGE_VISIBILITY_CHANGE_TO_VISIBLE_CONFIRMATION';
    }),
    distinctUntilChanged(),
  );

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'PAGE_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });
}
