import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { FormBuilder, Validators } from '@angular/forms';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { LoadTemplateComponent } from '../../../shared/editor-extensions/load-template/load-template.component';
import { TuiExpandModule } from '@taiga-ui/core';
import { TuiElasticContainerModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-page-edit-form',
  standalone: true,
  imports: [
    TuiLetModule,
    BaseFormImportsModule,
    TuiEditorModule,
    LoadTemplateComponent,
    TuiExpandModule,
    TuiElasticContainerModule,
  ],
  templateUrl: './page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditFormComponent {
  private readonly _service = inject(PageService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
  });

  readonly item$ = resourceFromRoute(this._service, (item) => {
    this.form.patchValue({
      ...item,
      author: item.creator.firstName + ' ' + item.creator.lastName,
    });
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.update(value),
    successAlertMessage: 'PAGE_UPDATE_SUCCESS',
  });
}
