import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
} from '@angular/core';
import { TuiButtonModule, TuiHostedDropdownModule } from '@taiga-ui/core';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';

@Component({
  selector: 'reunice-table-filter',
  templateUrl: './table-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrls: ['./table-filter.component.less'],
  imports: [TuiButtonModule, TuiHostedDropdownModule, TuiActiveZoneModule],
})
export class TableFilterComponent {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @HostBinding('class._open')
  open = false;
}
