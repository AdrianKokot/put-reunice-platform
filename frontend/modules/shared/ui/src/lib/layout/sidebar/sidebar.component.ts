import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneDirective, TuiActiveZoneModule } from '@taiga-ui/cdk';
import { TuiButtonModule } from '@taiga-ui/core';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import {
  Observable,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
} from 'rxjs';

@Component({
  selector: 'reunice-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TuiButtonModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
    PolymorpheusModule,
  ],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild(TuiActiveZoneDirective)
  private readonly _button!: TuiActiveZoneDirective;

  open$!: Observable<boolean>;

  private readonly _router = inject(Router);

  ngAfterViewInit() {
    this.open$ = merge(
      this._button.tuiActiveZoneChange,
      fromEvent(this._button['el'].nativeElement, 'click').pipe(
        map(() => true)
      ),
      this._router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => false)
      )
    ).pipe(distinctUntilChanged());
  }
}
