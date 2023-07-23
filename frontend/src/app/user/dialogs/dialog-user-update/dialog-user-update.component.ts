import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@reunice/modules/shared/data-access';
import { UserForm } from '@reunice/modules/shared/data-access';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-dialog-user-update',
  templateUrl: './dialog-user-update.component.html',
  styleUrls: ['./dialog-user-update.component.scss'],
})
export class DialogUserUpdateComponent {
  form = new FormGroup({
    firstName: new FormControl(this.data.user?.firstName ?? '', [
      Validators.required,
    ]),
    lastName: new FormControl(this.data.user?.lastName ?? '', [
      Validators.required,
    ]),
    email: new FormControl(this.data.user?.email ?? '', [Validators.email]),
    phoneNumber: new FormControl(this.data.user?.phoneNumber ?? '', [
      Validators.pattern('^(\\+?\\d{3,12})?$'),
    ]),
    description: new FormControl(this.data.user?.description ?? '', []),
  });

  pending = false;

  constructor(
    public dialogRef: MatDialogRef<DialogUserUpdateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Partial<{ user: UserForm & { id: number } }>,
    private userService: UserService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {
    dialogRef.disableClose = true;
  }

  updateUser() {
    if (this.data.user) {
      this.pending = true;

      const userData: UserForm = {
        firstName: this.form.controls.firstName.value,
        lastName: this.form.controls.lastName.value,
        email: this.form.controls.email.value,
        phoneNumber: this.form.controls.phoneNumber.value,
        description: this.form.controls.description.value,
      } as UserForm;

      this.userService.editUser(this.data.user.id, userData).subscribe({
        next: (result) => {
          this.dialogService.openSuccessDialog(
            this.translate.instant('EDIT_USER_SUCCESS')
          );
          this.dialogRef.close(result);
        },
        error: () => {
          this.pending = false;
        },
      });
    }
  }
}
