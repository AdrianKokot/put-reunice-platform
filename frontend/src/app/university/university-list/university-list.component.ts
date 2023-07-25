import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridApi,
  RowSelectedEvent,
} from 'ag-grid-community';

import { University } from 'modules/shared/data-access/src/lib/models/university';
import { UniversityService } from 'modules/shared/data-access/src/lib/services/university.service';
import { DialogUniversityCreateComponent } from '../dialog-university-create/dialog-university-create.component';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-university-list',
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.scss'],
})
export class UniversityListComponent implements OnInit {
  public columnDefs: ColDef[] = [];
  public defaultColDef: ColDef = {};
  public noRowsTemplate: string | undefined;
  universities: University[] = [];
  data: UniversityGridItem[] = [];
  gridApi?: GridApi;
  columnApi?: ColumnApi;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private universityService: UniversityService,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.translateColumnDefs();
      this.translateData();
    });
    this.loadColumn();
    this.loadUniversities();
  }

  loadUniversities() {
    this.universityService.getUniversities().subscribe({
      next: (res) => {
        this.universities = res;
        this.translateData();
      },
    });
  }

  translateData() {
    this.data = this.universities.map((university) => {
      const universityItem = university as UniversityGridItem;
      if (universityItem.hidden) {
        universityItem.hiddenTranslated = this.translate.instant('YES');
      } else {
        universityItem.hiddenTranslated = this.translate.instant('NO');
      }
      return universityItem;
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
        headerName: this.translate.instant('NAME'),
        field: 'name',
        flex: 1.5,
        minWidth: 200,
      },
      {
        headerName: this.translate.instant('SHORT_NAME'),
        field: 'shortName',
        minWidth: 200,
      },
      {
        headerName: this.translate.instant('IS_HIDDEN_UNIVERSITY'),
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
      filter: 'agTextColumnFilter',
      suppressMovable: true,
      sortable: true,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
      },
    };
  }

  addUniversity() {
    const dialogData = {
      data: {
        edit: false,
      },
    };
    const dialogRef = this.dialog.open(
      DialogUniversityCreateComponent,
      dialogData
    );

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (!result) return;
        this.loadUniversities();
      });
  }

  onRowSelected(event: RowSelectedEvent) {
    this.router.navigateByUrl('/university/' + event.data.id);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
}

interface UniversityGridItem extends University {
  hiddenTranslated: string;
}
