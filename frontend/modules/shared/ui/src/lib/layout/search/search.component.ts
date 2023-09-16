import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';
import {
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { PageService } from '@reunice/modules/shared/data-access';
import { TuiLetModule } from '@taiga-ui/cdk';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'reunice-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiLetModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  readonly search = new FormControl('');
  readonly pageService = inject(PageService);

  readonly results$ = this.search.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => (query ? this.pageService.search(query) : of([]))),
  );
}
