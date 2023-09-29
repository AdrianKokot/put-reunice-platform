import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/kit';
import { TuiGroupModule } from '@taiga-ui/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { resourceIdFromRoute } from '@reunice/modules/shared/util';
import { CommonModule } from '@angular/common';
import { startWith, switchMap } from 'rxjs';
import { TicketService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiAvatarModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiGroupModule,
    TuiButtonModule,
    TuiLetModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketComponent {
  private readonly _id$ = resourceIdFromRoute();

  private readonly _service = inject(TicketService);

  readonly ticket$ = this._id$.pipe(
    switchMap((id) => this._service.get(id).pipe(startWith(null))),
  );

  testForm = new FormGroup({
    testValue2: new FormControl(''),
  });
}
