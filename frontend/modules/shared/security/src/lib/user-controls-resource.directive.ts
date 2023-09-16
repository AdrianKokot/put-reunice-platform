import {
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ExtendedAccountTypeEnum,
  Keyword,
  Page,
  Template,
  University,
  User,
} from '@reunice/modules/shared/data-access';

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
  providers: [TuiDestroyService],
})
export class UserControlsResourceDirective implements OnInit {
  private readonly _user$ = inject(AuthService).user$.pipe(
    takeUntilDestroyed(),
  );

  @Input({
    alias: 'reuniceUserControlsResource',
  })
  controlledResource: User | Page | University | Template | Keyword | null =
    null;

  constructor(
    private readonly templateRef: TemplateRef<unknown>,
    private readonly viewContainer: ViewContainerRef,
    private readonly _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._user$.subscribe((user) => {
      this.viewContainer.clear();

      if (
        user !== null &&
        this.isUserAuthorizedToControlResource(user, this.controlledResource)
      ) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }

      this._cdr.markForCheck();
    });
  }

  private isUserAuthorizedToControlResource(
    user: User,
    resource: User | Page | University | Template | Keyword | null,
  ): boolean {
    if (resource === null) {
      return false;
    }

    if (user.accountType === ExtendedAccountTypeEnum.ADMIN) {
      return true;
    }

    const universityIds = this.getUniversityIdFromResource(resource);

    if (
      user.accountType === ExtendedAccountTypeEnum.MODERATOR &&
      user.enrolledUniversities.some((x) => universityIds.has(x.id))
    ) {
      return true;
    }

    return (
      user.accountType === ExtendedAccountTypeEnum.USER &&
      'creator' in resource &&
      user.id === resource.creator.id
    );
  }

  private getUniversityIdFromResource(
    resource: User | Page | University | Template | Keyword,
  ) {
    if ('university' in resource) {
      return new Set([resource.university.id]);
    }

    if ('enrolledUniversities' in resource) {
      return new Set(resource.enrolledUniversities.map((x) => x.id));
    }

    if ('universities' in resource && resource.universities !== null)
      return new Set(resource.universities.map((x) => x.id));

    return new Set([resource.id]);
  }
}
