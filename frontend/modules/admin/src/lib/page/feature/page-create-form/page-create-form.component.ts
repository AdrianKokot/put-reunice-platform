import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Page,
  PageService,
  UniversityService,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import { FormSubmitWrapper } from '@reunice/modules/shared/util';
import { navigateToResourceDetails } from '../../../shared/util/navigate-to-resource-details';
import { BaseFormImportsModule } from '../../../shared/base-form-imports.module';
import { TuiEditorModule } from '@tinkoff/tui-editor';
import { AuthService } from '@reunice/modules/shared/security';
import {
  distinctUntilChanged,
  filter,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ResourceSearchWrapper } from '../../../shared/util/resource-search-wrapper';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiRadioLabeledModule,
  TuiTreeModule,
} from '@taiga-ui/kit';
import { TuiHandler, TuiLetModule, TuiValueChangesModule } from '@taiga-ui/cdk';
import { RouterLinkActive } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';

@Component({
  selector: 'reunice-page-create-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiEditorModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiComboBoxModule,
    TuiValueChangesModule,
    TuiTreeModule,
    RouterLinkActive,
    TuiLinkModule,
    TuiRadioLabeledModule,
  ],
  templateUrl: './page-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageCreateFormComponent {
  private readonly _service = inject(PageService);

  constructor(auth: AuthService) {
    auth.user$
      .pipe(
        filter((user): user is User => user !== null),
        take(1),
        takeUntilDestroyed(),
        tap((user) =>
          this.form.patchValue({
            creatorId: user.id,
            universityId:
              user.enrolledUniversities.length > 0
                ? user.enrolledUniversities[0].id
                : null,
          })
        )
      )
      .subscribe();
  }

  readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
    content: [''],
    creatorId: [-1, [Validators.required]],
    parentId: [-1, [Validators.required]],
    universityId: [null as null | number, [Validators.required]],
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) => this._service.create(value),
    successAlertMessage: 'PAGE.CREATE.SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly userSearch = new ResourceSearchWrapper(
    inject(UserService),
    'search',
    'name'
  );

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'name_ct',
    'name'
  );

  readonly pagesTree$ = this.form.controls.universityId.valueChanges.pipe(
    distinctUntilChanged(),
    filter((id): id is number => id !== null),
    tap(() => this.form.controls.parentId.reset()),
    switchMap((id) =>
      this._service.getUniversityHierarchy(id).pipe(
        tap((page) => this.form.controls.parentId.setValue(page.id)),
        startWith(null)
      )
    ),
    shareReplay()
  );

  readonly pagesTreeHandler: TuiHandler<Page, readonly Page[]> = (item) =>
    item?.children ?? [];

  pageTreeMap = new Map<Page, boolean>();
}
