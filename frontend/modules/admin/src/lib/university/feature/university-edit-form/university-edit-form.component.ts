import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UniversityService } from '@reunice/modules/shared/data-access';
import {
  formResourceFromRoute,
  FormSubmitWrapper,
} from '@reunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  share,
  startWith,
  switchMap,
} from 'rxjs';
import { ConfirmDirective } from '@reunice/modules/shared/ui';
import { TuiInputFilesModule } from '@taiga-ui/kit';

@Component({
  selector: 'reunice-university-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiLetModule,
    ConfirmDirective,
    TuiInputFilesModule,
  ],
  templateUrl: './university-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityEditFormComponent {
  private readonly _service = inject(UniversityService);

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    shortName: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    address: ['', [Validators.maxLength(255)]],
    website: ['', [Validators.maxLength(255)]],
    file: [null as File | null],
  });

  readonly item$ = formResourceFromRoute(this._service, this.form);

  readonly confirmText$ = combineLatest([
    this.item$,
    this.form.valueChanges,
  ]).pipe(
    debounceTime(100),
    map(([item, formValue]) => {
      if (item?.hidden !== formValue.hidden) {
        return formValue.hidden
          ? 'UNIVERSITY_VISIBILITY_CHANGE_TO_HIDDEN_CONFIRMATION'
          : 'UNIVERSITY_VISIBILITY_CHANGE_TO_VISIBLE_CONFIRMATION';
      }

      return null;
    }),
    distinctUntilChanged(),
    share(),
  );

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: ({ file, ...value }) =>
      this._service
        .update(value)
        .pipe(
          switchMap((university) =>
            file !== null
              ? this._service
                  .uploadFile(university.id, file)
                  .pipe(map(() => university))
              : of(university),
          ),
        ),
    successAlertMessage: 'UNIVERSITY_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly state$ = this.form.controls.file.valueChanges.pipe(startWith(null));
}
