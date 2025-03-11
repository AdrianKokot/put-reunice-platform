import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'eunice-ui-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FooterComponent {}
