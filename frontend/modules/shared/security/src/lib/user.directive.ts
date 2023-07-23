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
  ACCOUNT_TYPES,
  AccountType,
  User,
} from '@reunice/modules/shared/data-access';
import { map, shareReplay, tap } from 'rxjs';
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

@Directive({ selector: '[reuniceUser]', standalone: true })
export class UserDirective implements OnInit {
  private readonly _userType$ = inject(AuthService).user$.pipe(
    takeUntilDestroyed(),
    map((user) => ({ type: user?.accountType ?? AccountType.Guest, user })),
    tap(console.log),
    shareReplay()
  );

  private _context = new UserContext();

  @Input({
    alias: 'reuniceUser',
    transform: (value: string) => {
      console.assert(
        ACCOUNT_TYPES.has(value),
        `Passed invalid account type: ${value}`
      );
      return ACCOUNT_TYPES.has(value) ? value : null;
    },
  })
  reuniceUser: AccountType = AccountType.Authorized;

  @Input()
  reuniceUserElse: TemplateRef<unknown> | null = null;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._userType$.subscribe(({ type, user }) => {
      if (this.reuniceUser === null) {
        return;
      }

      this.viewContainer.clear();

      if (type === this.reuniceUser) {
        this.viewContainer.createEmbeddedView(this.templateRef, this._context);
      } else if (this.reuniceUserElse !== null) {
        this.viewContainer.createEmbeddedView(
          this.reuniceUserElse,
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
