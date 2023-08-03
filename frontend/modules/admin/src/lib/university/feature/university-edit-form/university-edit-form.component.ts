import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { University } from '@reunice/modules/shared/data-access';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-university-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TuiLabelModule,
    TranslateModule,
    TuiInputModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiTextAreaModule,
    TuiLetModule,
    TuiSelectModule,
    TuiDataListModule,
  ],
  templateUrl: './university-edit-form.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityEditFormComponent implements OnInit {
  @Input()
  university$: Observable<University> | null = null;

  @Input()
  readonly readOnly = false;

  readonly form = inject(FormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    shortName: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    hidden: [true, [Validators.required]],
  });

  ngOnInit(): void {
    this.university$?.subscribe((university) => {
      this.form.patchValue(university);
    });
  }
}
