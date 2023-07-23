import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../../assets/service/dialog.service';
import { UserService } from '../../../../../modules/shared/data-access/src/lib/services/user.service';

@Component({
  selector: 'reunice-dialog-user-change-username',
  templateUrl: './dialog-user-change-username.component.html',
  styleUrls: ['./dialog-user-change-username.component.scss'],
})
export class DialogUserChangeUsernameComponent {
  usernameControl = new FormControl('', [Validators.required]);
  pending = false;

  constructor(
    public dialogRef: MatDialogRef<DialogUserChangeUsernameComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: { id: number; username: string } },
    private userService: UserService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.dialogService.openSuccessDialog(
            this.translate.instant('USERNAME_CHANGED')
          );
        }
      },
    });
  }

  changeUsername(username: string | null) {
    if (this.data.user && username) {
      this.pending = true;
      this.userService
        .modifyUserUsernameField(this.data.user.id, username)
        .subscribe({
          next: () => {
            if (this.data.user) {
              this.data.user.username = username;
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
