import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'reunice-not-found',
  standalone: true,
  imports: [
    CommonModule,
    TuiBlockStatusModule,
    TranslateModule,
    RouterLink,
    TuiButtonModule,
  ],
  templateUrl: './not-found.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
