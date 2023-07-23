import { Component, OnInit } from '@angular/core';
import { PageService } from '@reunice/modules/shared/data-access';
import { Page } from '@reunice/modules/shared/data-access';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../assets/service/spinner.service';
import { DialogService } from '../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-page-user',
  templateUrl: './page-user.component.html',
  styleUrls: ['./page-user.component.scss'],
})
export class PageUserComponent implements OnInit {
  pages: Page[] = [];
  public id = 0;

  constructor(
    private route: ActivatedRoute,
    private spinnerService: SpinnerService,
    private dialogService: DialogService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('userId'));
    this.loadPages(this.id);
  }

  loadPages(userId: number) {
    this.spinnerService.show();
    this.pageService.getPages().subscribe({
      next: (res) => {
        this.spinnerService.hide();
        this.pages = res.filter((element) => element.creator.id == userId);
      },
      error: () => {
        this.spinnerService.hide();
      },
    });
  }
}
