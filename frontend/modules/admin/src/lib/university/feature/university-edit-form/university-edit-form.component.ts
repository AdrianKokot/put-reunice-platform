import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAX_FILE_SIZE,
  UniversityService,
} from '@eunice/modules/shared/data-access';
import {
  formResourceFromRoute,
  FormSubmitWrapper,
} from '@eunice/modules/shared/util';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
} from '../../../shared';
import { TuiLetModule } from '@taiga-ui/cdk';
import { combineLatest, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { ConfirmDirective } from '@eunice/modules/shared/ui';
import { TuiInputFilesModule } from '@taiga-ui/kit';

@Component({
  selector: 'eunice-university-edit-form',
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
    this.form.controls.hidden.valueChanges,
  ]).pipe(
    map(([item, hidden]) => {
      if (item?.hidden === hidden) return null;

      return hidden
        ? 'UNIVERSITY_VISIBILITY_CHANGE_TO_HIDDEN_CONFIRMATION'
        : 'UNIVERSITY_VISIBILITY_CHANGE_TO_VISIBLE_CONFIRMATION';
    }),
    distinctUntilChanged(),
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
  protected readonly MAX_FILE_SIZE = MAX_FILE_SIZE;
}
