import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapperModule, TuiInputModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { SearchService } from '@reunice/modules/shared/data-access';
import { TuiElementModule, TuiForModule, TuiLetModule } from '@taiga-ui/cdk';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgForTrackByIdDirective } from '@reunice/modules/shared/util';

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
    NgForTrackByIdDirective,
    TuiDataListWrapperModule,
    TuiForModule,
    TuiLoaderModule,
    TuiButtonModule,
    TuiElementModule,
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
    switchMap((query) => this.service.searchPages(query).pipe(startWith(null))),
  );
}
