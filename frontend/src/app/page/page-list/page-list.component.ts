import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  RowSelectedEvent,
} from 'ag-grid-community';
import { Page } from 'modules/shared/data-access/src/lib/models/page';

import { PageService } from '@reunice/modules/shared/data-access';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
})
export class PageListComponent implements OnInit {
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {};
  public noRowsTemplate = '';
  pages: Page[] = [];
  data: PageGridItem[] = [];
  gridApi?: GridApi;
  columnApi?: ColumnApi;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private pageService: PageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.translateColumnDefs();
      this.translateData();
    });
    this.loadColumn();
    this.loadPages();
  }

  loadPages() {
    this.pageService.getPages().subscribe({
      next: (res) => {
        this.pages = res;
        this.translateData();
      },
    });
  }

  translateData() {
    this.data = this.pages.map((page) => {
      const pageItem = page as PageGridItem;
      const [dateComponents, timeComponents] = pageItem.createdOn.split(' ');
      const [day, month, year] = dateComponents.split('-');
      const [hour, minute, second] = timeComponents.split(':');
      pageItem.createdOnAsDate = new Date(
        +year,
        +month - 1,
        +day,
        +hour,
        +minute,
        +second
      );
      if (pageItem.hidden) {
        pageItem.hiddenTranslated = this.translate.instant('YES');
      } else {
        pageItem.hiddenTranslated = this.translate.instant('NO');
      }
      return pageItem;
    });
  }

  translateColumnDefs() {
    this.columnDefs = [
      {
        headerName: this.translate.instant('ID'),
        field: 'id',
        flex: 0.5,
        minWidth: 80,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: this.translate.instant('TITLE'),
        field: 'title',
        flex: 2,
        minWidth: 200,
      },
      {
        headerName: this.translate.instant('CREATED_ON'),
        field: 'createdOnAsDate',
        minWidth: 200,
        filter: 'agDateColumnFilter',
        filterValueGetter: (params) => {
          const date: Date = params.data.createdOnAsDate as Date;
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        },
        valueFormatter: (params) => params.data.createdOn,
      },
      {
        headerName: this.translate.instant('UNIVERSITY'),
        field: 'university.shortName',
      },
      {
        headerName: this.translate.instant('AUTHOR'),
        field: 'creator.username',
      },
      {
        headerName: this.translate.instant('IS_HIDDEN_PAGE'),
        field: 'hiddenTranslated',
        minWidth: 100,
      },
    ];
    this.noRowsTemplate = this.translate.instant('NO_ROWS_TO_SHOW');
  }

  loadColumn() {
    this.translateColumnDefs();
    this.defaultColDef = {
      flex: 1,
      minWidth: 150,
      filter: 'agTextColumnFilter',
      suppressMovable: true,
      sortable: true,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
      },
    };
  }

  onRowSelected(event: RowSelectedEvent) {
    this.router.navigateByUrl('/page/' + event.data.id);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
}

interface PageGridItem extends Page {
  createdOnAsDate: Date;
  hiddenTranslated: string;
}
