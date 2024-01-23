/* eslint-disable @angular-eslint/no-input-rename */
import {
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AccountTypeEnum,
  ExtendedAccountTypeEnum,
  Page,
  Resource,
  Template,
  University,
  User,
} from '@reunice/modules/shared/data-access';
import { combineLatest, Subject } from 'rxjs';

class UserControlsResourceContext<T = unknown> {
  public $implicit: T;
  public reuniceUserControlsResource: T;
  public controlledResource: T;

  constructor(value: T) {
    this.$implicit = value;
    this.reuniceUserControlsResource = value;
    this.controlledResource = value;
  }
}

/**
 * @description This directive is used to show or hide content based on the user's
 *              permission to control the given resource.
 * @example
 * <div *reuniceUserControlsResource="page">
 *   <p>
 *     Content available only for user that is either creator of the page,
 *     administrator of the university that is parent of the page
 *     or main administrator
 *   </p>
 *  </div>
 */
@Directive({
  selector: '[reuniceUserControlsResource]',
  standalone: true,
})
export class UserControlsResourceDirective<
  T extends User | Page | University | Template | Resource,
> implements OnChanges
{
  private readonly _trigger$ = new Subject<void>();

  @Input({
    alias: 'reuniceUserControlsResource',
  })
  controlledResource: T | null = null;

  @Input({
    alias: 'reuniceUserControlsResourceElse',
  })
  fallbackTemplate: TemplateRef<unknown> | null = null;

  constructor(
    private readonly templateRef: TemplateRef<UserControlsResourceContext<T>>,
    private readonly viewContainer: ViewContainerRef,
    cdr: ChangeDetectorRef,
  ) {
    combineLatest([inject(AuthService).user$, this._trigger$])
      .pipe(takeUntilDestroyed())
      .subscribe(([user]) => {
        this.viewContainer.clear();

        if (
          user !== null &&
          this.controlledResource !== null &&
          UserControlsResourceDirective.isUserAuthorizedToControlResource(
            user,
            this.controlledResource,
          )
        ) {
          this.viewContainer.createEmbeddedView(
            this.templateRef,
            new UserControlsResourceContext<T>(this.controlledResource),
          );
        } else if (this.fallbackTemplate !== null) {
          this.viewContainer.createEmbeddedView(this.fallbackTemplate);
        }

        cdr.markForCheck();
      });
  }

  ngOnChanges(): void {
    this._trigger$.next();
  }

  private static isUserAuthorizedToControlResource(
    user: User,
    resource: User | Page | University | Template | Resource | null,
  ): boolean {
    if (resource === null) {
      return false;
    }

    if (user.accountType === ExtendedAccountTypeEnum.ADMIN) {
      return true;
    }

    if (
      'availableToAllUniversities' in resource &&
      resource.availableToAllUniversities
    ) {
      return false;
    }

    const universityIds = this.getUniversityIdFromResource(resource);

    if (user.enrolledUniversities.some((x) => universityIds.has(x.id))) {
      if ('accountType' in resource) {
        return user.accountType !== AccountTypeEnum.USER;
      }

      return true;
    }

    if ('resourceType' in resource) return true;

    return (
      user.accountType === ExtendedAccountTypeEnum.USER &&
      'creator' in resource &&
      user.id === resource.creator?.id
    );
  }

  private static getUniversityIdFromResource(
    resource: User | Page | University | Template | Resource,
  ) {
    if ('universityId' in resource) {
      return new Set([resource.universityId]);
    }
    if ('university' in resource) {
      return new Set([resource.university?.id]);
    }

    if ('enrolledUniversities' in resource) {
      return new Set(resource.enrolledUniversities.map((x) => x.id));
    }

    if ('universities' in resource && resource.universities !== null)
      return new Set(resource.universities.map((x) => x.id));

    return new Set([resource.id]);
  }

  static ngTemplateContextGuard<
    T extends User | Page | University | Template | Resource,
  >(
    dir: UserControlsResourceDirective<T>,
    ctx: unknown,
  ): ctx is UserControlsResourceContext<
    Exclude<T, false | 0 | '' | null | undefined>
  > {
    return true;
  }
}
