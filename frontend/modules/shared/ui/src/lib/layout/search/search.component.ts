import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiInputModule} from '@taiga-ui/kit';
import {TuiDataListModule, TuiTextfieldControllerModule} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, map, of } from 'rxjs';
import { PageService } from '@reunice/modules/shared/data-access';
import { TuiLetModule, TuiActiveZoneModule } from '@taiga-ui/cdk';

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
    TuiActiveZoneModule
  ],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  readonly search = new FormControl('');
  readonly pageService = inject(PageService);

  readonly results$ = this.search.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((query) => query ? this.pageService.search(query) : of([])),
    map(pages => pages.map(page => ({...page, link: `/universities/${page.university.id}/page/${page.id}`})))
  );
}
