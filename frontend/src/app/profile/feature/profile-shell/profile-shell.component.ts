import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'eunice-profile-shell',
  standalone: true,
  templateUrl: './profile-shell.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, TuiTabsModule, RouterModule],
})
export class ProfileShellComponent {}
