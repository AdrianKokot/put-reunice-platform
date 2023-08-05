import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiLetModule,
  tuiMarkControlAsTouchedAndValidate,
} from '@taiga-ui/cdk';
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
import { UniversityService } from '@reunice/modules/shared/data-access';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'reunice-university-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TuiLabelModule,
    TranslateModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiTextAreaModule,
    TuiLetModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiButtonModule,
  ],
  templateUrl: './university-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityEditFormComponent {
  private readonly _service = inject(UniversityService);
  private readonly _alert = inject(TuiAlertService);

  university$ = inject(ActivatedRoute).paramMap.pipe(
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
        .open('University updated successfully', { status: 'success' })
        .pipe(
          startWith(null),
          map(() => false)
        );
    })
  );

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    shortName: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
  });
}
