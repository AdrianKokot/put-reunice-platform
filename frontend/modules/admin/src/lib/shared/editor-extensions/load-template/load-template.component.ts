import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiTiptapEditorService } from '@tinkoff/tui-editor';
import {
  Template,
  TemplateService,
  University,
} from '@reunice/modules/shared/data-access';
import { startWith, Subject, switchMap } from 'rxjs';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHintModule,
  TuiHostedDropdownModule,
} from '@taiga-ui/core';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'reunice-load-template-tool',
  standalone: true,
  imports: [
    CommonModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiActiveZoneModule,
    TuiLetModule,
    TranslateModule,
    TuiHintModule,
    TuiDataListModule,
  ],
  templateUrl: './load-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: 't-tool t-tool_margin t-tool__load-template',
  },
  styleUrls: ['./load-template.component.less'],
})
export class LoadTemplateComponent {
  private readonly _service = inject(TemplateService);
  private readonly _editor = inject(TuiTiptapEditorService);
  private readonly _universityId$ = new Subject<University['id']>();

  @Input() set universityId(value: University['id'] | null) {
    if (value !== null) this._universityId$.next(value);
  }

  readonly templates$ = this._universityId$.pipe(
    switchMap((universityId) =>
      this._service
        .getTemplatesForUniversity(universityId)
        .pipe(startWith(null)),
    ),
  );

  loadTemplate(template: Template): void {
    this._editor
      .getOriginTiptapEditor()
      .chain()
      .focus()
      .clearContent()
      .insertContent(template.content)
      .run();
  }
}
