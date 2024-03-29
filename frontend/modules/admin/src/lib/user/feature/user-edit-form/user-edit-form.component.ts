import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  ExtendedAccountTypeEnum,
  UniversityService,
  User,
  UserService,
} from '@eunice/modules/shared/data-access';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@eunice/modules/shared/util';
import { FormBuilder, Validators } from '@angular/forms';
import {
  BaseFormImportsModule,
  navigateToResourceDetails,
  ResourceSearchWrapper,
} from '../../../shared';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { AuthService, UserDirective } from '@eunice/modules/shared/security';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs';
import { TuiHintModule } from '@taiga-ui/core';
import { ConfirmDirective } from '@eunice/modules/shared/ui';

@Component({
  selector: 'eunice-user-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiDataListWrapperModule,
    TuiHintModule,
    UserDirective,
    TuiInputPasswordModule,
    TuiComboBoxModule,
    ConfirmDirective,
  ],
  templateUrl: './user-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditFormComponent {
  private readonly _service = inject(UserService);
  private readonly _user = inject(AuthService).userSnapshot;

  readonly form = inject(FormBuilder).nonNullable.group({
    id: [-1, [Validators.required]],
    username: ['', [Validators.required, Validators.maxLength(255)]],
    firstName: ['', [Validators.required, Validators.maxLength(255)]],
    lastName: ['', [Validators.required, Validators.maxLength(255)]],
    email: [
      '',
      [Validators.required, Validators.maxLength(255), Validators.email],
    ],
    phoneNumber: ['', [Validators.required, Validators.maxLength(255)]],
    accountType: [AccountTypeEnum.USER, [Validators.required]],
    enabled: [true, [Validators.required]],
    enrolledUniversities: [null as number | null],
    password: [''],
  });

  readonly universitySearch = new ResourceSearchWrapper(
    inject(UniversityService),
    'search',
    'name',
  );

  readonly item$ = resourceFromRoute(this._service, (user) => {
    this.form.patchValue({
      ...user,
      enrolledUniversities: user.enrolledUniversities.at(0)?.id,
    });

    this.universitySearch.addItems(user.enrolledUniversities);
  });

  readonly handler = new FormSubmitWrapper(this.form, {
    submit: (value) =>
      this._service.update({
        ...value,
        enrolledUniversities:
          value.enrolledUniversities !== null
            ? [value.enrolledUniversities]
            : [],
      }),
    successAlertMessage: 'USER_UPDATE_SUCCESS',
    effect: navigateToResourceDetails(),
  });

  readonly accountType = AccountTypeEnum;

  readonly editingOwnAccount$ = this.item$.pipe(
    filter((user): user is User => user !== null),
    map((user) => user.id === this._user?.id),
    startWith(false),
  );

  readonly confirmText$ = combineLatest([
    this.item$,
    this.form.controls.enabled.valueChanges,
  ]).pipe(
    map(([item, enabled]) => {
      if (item?.enabled === enabled) return null;
      return enabled
        ? 'USER_CHANGE_TO_ENABLED_CONFIRMATION'
        : 'USER_CHANGE_TO_DISABLED_CONFIRMATION';
    }),
    distinctUntilChanged(),
  );

  readonly allFieldsReadonly$ = this.item$.pipe(
    filter((user): user is User => user !== null),
    map(
      (user) =>
        this._user?.accountType !== ExtendedAccountTypeEnum.ADMIN &&
        (user.accountType === ExtendedAccountTypeEnum.ADMIN ||
          !this._user?.enrolledUniversities.every((u) =>
            user.enrolledUniversities.some((eu) => eu.id === u.id),
          )),
    ),
    startWith(true),
  );
}
