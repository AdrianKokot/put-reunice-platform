import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '@reunice/modules/shared/data-access';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDataListModule,
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
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TuiEditorModule } from '@tinkoff/tui-editor';

@Component({
  selector: 'reunice-page-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    ReactiveFormsModule,
    TranslateModule,
    TuiLabelModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiTextAreaModule,
    RouterLink,
    TuiEditorModule,
    TuiButtonModule,
  ],
  templateUrl: './page-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEditFormComponent {
  private readonly _service = inject(PageService);
  private readonly _alert = inject(TuiAlertService);

  item$ = inject(ActivatedRoute).paramMap.pipe(
    filter((params) => params.has('id')),
    map((params) => params.get('id') ?? ''),
    switchMap((id) =>
      this._service.get(id).pipe(
        tap((item) =>
          this.form.patchValue({
            ...item,
            author: item.creator.firstName + ' ' + item.creator.lastName,
          })
        ),
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
        .open('Page updated successfully', { status: TuiNotification.Success })
        .pipe(
          startWith(null),
          map(() => false)
        );
    })
  );

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    author: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
  });
}
