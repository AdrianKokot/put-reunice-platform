import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SideService } from './shared/side.service';

@Component({
  selector: 'reunice-root',
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./root.component.less'],
})
export class RootComponent {
  readonly side = inject(SideService);
}
