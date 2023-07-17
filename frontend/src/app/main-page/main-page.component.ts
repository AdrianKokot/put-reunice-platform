import { Component, OnInit } from '@angular/core';
import { PageService } from '../../assets/service/page.service';
import { Page } from '../../assets/models/page';
import { PageCardConfig } from '../page/page-card/page-card.component';
import { DialogService } from 'src/assets/service/dialog.service';
import { SpinnerService } from 'src/assets/service/spinner.service';

@Component({
  selector: 'reunice-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  pages: Page[] = [];
  breakpoint = 4;

  cardConfig: PageCardConfig = {
    useSecondaryColor: false,
    showLink: true,
    showDescription: false,
    showUniversity: false,
    showCreatedOn: false,
    showAuthor: false,
  };

  constructor(
    private dialogService: DialogService,
    private spinnerService: SpinnerService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.loadPages();
    this.breakpoint = this.countBreakpoint(innerWidth);
  }

  loadPages() {
    this.spinnerService.show();
    this.pageService.getMainPages().subscribe({
      next: (res) => {
        this.pages = res;
        this.spinnerService.hide();
      },
      error: () => {
        this.spinnerService.hide();
      },
    });
  }

  onResize(event: Event) {
    if (!(event.target instanceof Window)) {
      return;
    }
    this.breakpoint = this.countBreakpoint(event.target.innerWidth);
  }

  countBreakpoint(width: number): number {
    if (width < 800) return Math.floor(width / 325);
    return Math.floor(width / 400);
  }
}
