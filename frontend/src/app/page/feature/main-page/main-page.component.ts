import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from '../page/page.component';
import { UniversityListComponent } from '../../../university/feature/university-list/university-list.component';

@Component({
  selector: 'reunice-main-page',
  standalone: true,
  imports: [CommonModule, PageComponent, UniversityListComponent],
  templateUrl: './main-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {}
