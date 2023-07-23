import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@reunice/modules/shared/data-access';

@Component({
  selector: 'reunice-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  @Input() user?: User;
  @Input() config: UserCardConfig = {} as UserCardConfig;

  constructor(private translate: TranslateService) {}

  getTranslatedAccountType() {
    switch (this.user?.accountType) {
      case 'ADMIN':
        return this.translate.instant('MAIN_ADMIN');
      case 'MODERATOR':
        return this.translate.instant('UNIVERSITY_ADMIN');
      case 'USER':
        return this.translate.instant('USER');
    }
  }
}

export interface UserCardConfig {
  useSecondaryColor: boolean;
  showLink: boolean;
}
