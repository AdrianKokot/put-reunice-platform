import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PageService } from '../../../assets/service/page.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-dialog-page-creator',
  templateUrl: './dialog-page-creator.component.html',
  styleUrls: ['./dialog-page-creator.component.scss'],
})
export class DialogPageCreatorComponent implements OnInit {
  creatorUsernameValid = new FormControl('', Validators['required']);
  pageId = 0;
  creatorUsername = '';

  constructor(
    public dialogRef: MatDialogRef<DialogPageCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private pageService: PageService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.pageId = this.data.id as number;
    this.creatorUsername = this.data.username as string;
  }

  changePageCreator() {
    if (this.creatorUsernameValid.status == 'VALID') {
      this.pageService
        .changePageCreator(this.pageId, this.creatorUsername)
        .subscribe({
          next: () => {
            this.dialogService.openSuccessDialog(
              this.translate.instant('CREATOR_CHANGED')
            );
          },
        });
      this.close();
    }
  }

  close(add = false) {
    if (add) this.dialogRef.close(add);
    else this.dialogRef.close();
  }
}

export interface DialogData {
  id?: number;
  username?: string;
}
