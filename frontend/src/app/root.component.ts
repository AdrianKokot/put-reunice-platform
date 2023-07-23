import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'reunice-root',
  templateUrl: './root.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {}
