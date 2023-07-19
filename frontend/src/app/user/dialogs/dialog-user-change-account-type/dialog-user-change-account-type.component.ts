import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../../assets/service/dialog.service';
import { UserService } from '../../../../assets/service/user.service';

@Component({
  selector: 'reunice-dialog-user-change-account-type',
  templateUrl: './dialog-user-change-account-type.component.html',
  styleUrls: ['./dialog-user-change-account-type.component.scss'],
})
export class DialogUserChangeAccountTypeComponent {
  accountTypeControl = new FormControl(this.data.user?.accountType ?? '', [
    Validators.required,
  ]);

  pending = false;

  constructor(
    public dialogRef: MatDialogRef<DialogUserChangeAccountTypeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: { id: number; accountType: string } },
    private userService: UserService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogService.openSuccessDialog(
          this.translate.instant('ACCOUNT_TYPE_CHANGED')
        );
      }
    });
  }

  changeAccountType(accountType: string | null) {
    if (this.data.user && accountType) {
      this.pending = true;
      this.userService
        .modifyUserAccountTypeField(this.data.user.id, accountType)
        .subscribe({
          next: () => {
            if (this.data.user) {
              this.data.user.accountType = accountType;
            }
            this.dialogRef.close(true);
          },
          error: () => {
            this.pending = false;
          },
        });
    }
  }
}
