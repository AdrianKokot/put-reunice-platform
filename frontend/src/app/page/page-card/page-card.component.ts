import { Component, Input } from '@angular/core';
import { Page } from '@reunice/modules/shared/data-access';
import { SecurityService } from '@reunice/modules/shared/data-access';

@Component({
  selector: 'reunice-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.scss'],
})
export class PageCardComponent {
  @Input() page?: Page;
  @Input() config: PageCardConfig = {} as PageCardConfig;

  constructor(public securityService: SecurityService) {}
}

export interface PageCardConfig {
  useSecondaryColor: boolean;
  showLink: boolean;
  showDescription: boolean;
  showUniversity: boolean;
  showCreatedOn: boolean;
  showAuthor: boolean;
}
