import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from '../../../assets/service/template.service';
import { DialogTemplateCreateComponent } from '../dialog-template-create/dialog-template-create.component';

@Component({
  selector: 'app-dialog-template-change-name',
  templateUrl: './dialog-template-change-name.component.html',
  styleUrls: ['./dialog-template-change-name.component.scss'],
})
export class DialogTemplateChangeNameComponent {
  nameControl = new FormControl('', [Validators.required]);

  pending = false;

  constructor(
    public dialogRef: MatDialogRef<DialogTemplateCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private templateService: TemplateService
  ) {
    dialogRef.disableClose = true;
  }

  renameTemplate(name: string | null) {
    if (name && this.data.id) {
      this.pending = true;
      this.templateService
        .modifyTemplateNameField(this.data.id, name)
        .subscribe({
          next: () => {
            this.dialogRef.close(name);
          },
          error: () => {
            this.pending = false;
          },
        });
    }
  }
}
