import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PageService } from '@eunice/modules/shared/data-access';
import { startWith } from 'rxjs';
import { TuiIslandModule, TuiLineClampModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiForModule, TuiLetModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'eunice-university-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    RouterLink,
    TuiLoaderModule,
    TuiForModule,
    TranslateModule,
    NgOptimizedImage,
    TuiLetModule,
    TuiLineClampModule,
  ],
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {
  @Input() showHeader = true;

  readonly universities$ = inject(PageService)
    .getMainPages()
    .pipe(startWith(null));
}
