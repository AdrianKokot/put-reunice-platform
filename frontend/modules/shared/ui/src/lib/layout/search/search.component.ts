import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { SearchService } from '@eunice/modules/shared/data-access';
import {
  TuiDataListModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { TuiElementModule, TuiLetModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'eunice-search',
  standalone: true,
  imports: [
    CommonModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiDataListModule,
    RouterLink,
    TuiElementModule,
    TuiLoaderModule,
    TranslateModule,
    TuiHintModule,
    TuiLetModule,
  ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly service = inject(SearchService);
  readonly search = new FormControl('', { nonNullable: true });

  get canOpen(): boolean {
    return this.search.value.length > 2;
  }

  readonly results$ = this.search.valueChanges.pipe(
    startWith(this.search.value),
    debounceTime(300),
    distinctUntilChanged(),
    filter(() => this.canOpen),
    switchMap((query) => this.service.searchPages(query).pipe(startWith(null))),
    shareReplay(1),
  );
}
