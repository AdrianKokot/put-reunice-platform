import { Component, OnInit } from '@angular/core';
import { PageService } from '@reunice/modules/shared/data-access';
import { Page } from '@reunice/modules/shared/data-access';
import { ActivatedRoute } from '@angular/router';
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
    private dialogService: DialogService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('userId'));
    this.loadPages(this.id);
  }

  loadPages(userId: number) {
    this.pageService.getPages().subscribe({
      next: (res) => {
        this.pages = res.filter((element) => element.creator.id == userId);
      },
    });
  }
}
