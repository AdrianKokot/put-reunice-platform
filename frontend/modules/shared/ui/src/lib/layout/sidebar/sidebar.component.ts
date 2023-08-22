import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'reunice-sidebar',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    PolymorpheusModule,
  ],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  open = false;

  toggle(open: boolean) {
    this.open = open;
  }
}
