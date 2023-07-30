/* eslint-disable @angular-eslint/no-input-rename */
import {
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from './auth.service';
import {
  AccountType,
  AccountTypeEnum,
  User,
} from '@reunice/modules/shared/data-access';
import { distinctUntilKeyChanged, map, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

class UserContext {
  get $implicit(): User | null {
    return this.user;
  }

  user: User | null = null;

  get isLoggedIn(): boolean {
    return this.user !== null;
  }
}

/**
 * @description This directive is used to show or hide content based on the user's account type.
 *              Directive also exposes context with user data.
 * @example
 * <div *reuniceUser="AccountTypeEnum.AUTHORIZED; else unauthorized; let user = user">
 *   <p>Hello {{ user.firstName }} {{ user.lastName }}</p>
 *  </div>
 *  <ng-template #unauthorized>
 *    <p>Unauthorized content</p>
 *  </ng-template>
 *
 *  @example
 *  <div *reuniceUser="AccountTypeEnum.GUEST; else authorized">
 *    <p>Guest content</p>
 *  </div>
 *  <ng-template #authorized let-user>
 *    <p>Hello {{ user.firstName }} {{ user.lastName }}</p>
 *  </ng-template>
 */
@Directive({ selector: '[reuniceUser]', standalone: true })
export class UserDirective implements OnInit {
  private readonly _userType$ = inject(AuthService).user$.pipe(
    takeUntilDestroyed(),
    map((user) => ({ type: user?.accountType ?? AccountTypeEnum.GUEST, user })),
    shareReplay()
  );

  private _context = new UserContext();

  @Input({
    alias: 'reuniceUser',
    transform: (value: string) => {
      console.assert(
        value in AccountTypeEnum,
        `Passed invalid account type: ${value}`
      );
      return value in AccountTypeEnum ? value : null;
    },
  })
  requiredAccountType: AccountType | null = AccountTypeEnum.AUTHORIZED;

  @Input('reuniceUserElse')
  fallbackTemplate: TemplateRef<unknown> | null = null;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._userType$
      .pipe(distinctUntilKeyChanged('type'))
      .subscribe(({ type, user }) => {
        this.viewContainer.clear();

        if (
          type === this.requiredAccountType ||
          this.requiredAccountType === null
        ) {
          this.viewContainer.createEmbeddedView(
            this.templateRef,
            this._context
          );
        } else if (this.fallbackTemplate !== null) {
          this.viewContainer.createEmbeddedView(
            this.fallbackTemplate,
            this._context
          );
        }

        this._context.user = user;
        this._cdr.markForCheck();
      });
  }

  static ngTemplateContextGuard(
    _dir: UserDirective,
    _ctx: unknown
  ): _ctx is UserContext {
    return true;
  }
}