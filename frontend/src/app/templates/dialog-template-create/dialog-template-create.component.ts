import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from '@reunice/modules/shared/data-access';

@Component({
  selector: 'reunice-dialog-template-create',
  templateUrl: './dialog-template-create.component.html',
  styleUrls: ['./dialog-template-create.component.scss'],
})
export class DialogTemplateCreateComponent {
  nameControl = new FormControl('', [Validators.required]);

  pending = false;

  constructor(
    public dialogRef: MatDialogRef<DialogTemplateCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown,
    private templateService: TemplateService
  ) {
    dialogRef.disableClose = true;
  }

  createTemplate(name: string | null) {
    if (name) {
      this.pending = true;
      this.templateService.addTemplate(name).subscribe({
        next: (res) => {
          this.dialogRef.close(res);
        },
        error: () => {
          this.pending = false;
        },
      });
    }
  }
}
