import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TemplateService } from '@reunice/modules/shared/data-access';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiNotification,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mergeMap,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  TuiLetModule,
  tuiMarkControlAsTouchedAndValidate,
} from '@taiga-ui/cdk';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TuiFieldErrorPipeModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reunice-template-edit-form',
  templateUrl: './template-edit-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TuiLabelModule,
    ReactiveFormsModule,
    TuiFieldErrorPipeModule,
    TuiErrorModule,
    TuiEditorModule,
    TuiButtonModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateEditFormComponent {
  private readonly _service = inject(TemplateService);
  private readonly _alert = inject(TuiAlertService);

  item$ = inject(ActivatedRoute).paramMap.pipe(
    filter((params) => params.has('id')),
    map((params) => params.get('id') ?? ''),
    switchMap((id) =>
      this._service.get(id).pipe(
        tap((item) => this.form.patchValue(item)),
        startWith(null)
      )
    ),
    shareReplay()
  );

  readonly submit$ = new Subject<void>();
  readonly showLoader$ = this.submit$.pipe(
    filter(() => {
      if (this.form.invalid) {
        tuiMarkControlAsTouchedAndValidate(this.form);
        return false;
      }

      return true;
    }),
    exhaustMap(() =>
      this._service.update(this.form.getRawValue()).pipe(
        catchError((err: HttpErrorResponse) => {
          // TODO Handle validation errors
          console.log(err);
          return of(false);
        }),
        startWith(true)
      )
    ),
    mergeMap((result) => {
      if (typeof result === 'boolean') {
        return of(result);
      }

      this.form.patchValue(result);

      return this._alert
        .open('Template updated successfully', {
          status: TuiNotification.Success,
        })
        .pipe(
          startWith(null),
          map(() => false)
        );
    })
  );

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    // author: ['', [Validators.required, Validators.maxLength(255)]],
    // description: ['', [Validators.required, Validators.maxLength(255)]],
    // hidden: [true, [Validators.required]],
    content: [''],
  });
}
