import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AccountTypeEnum,
  ExtendedAccountTypeEnum,
  UniversityService,
  User,
  UserService,
} from '@reunice/modules/shared/data-access';
import {
  FormSubmitWrapper,
  resourceFromRoute,
} from '@reunice/modules/shared/util';
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
import { AuthService, UserDirective } from '@reunice/modules/shared/security';
import { filter, map, startWith } from 'rxjs';
import { TuiHintModule } from '@taiga-ui/core';

@Component({
  selector: 'reunice-user-edit-form',
  standalone: true,
  imports: [
    BaseFormImportsModule,
    TuiDataListWrapperModule,
    TuiHintModule,
    UserDirective,
    TuiInputPasswordModule,
    TuiComboBoxModule,
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
    'name_ct',
    'name',
  );

  readonly item$ = resourceFromRoute(this._service, (user) => {
    this.form.patchValue({
      ...user,
      enrolledUniversities: user.enrolledUniversities.at(0)?.id,
    });
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
