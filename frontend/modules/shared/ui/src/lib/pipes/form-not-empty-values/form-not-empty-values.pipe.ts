import { Pipe, PipeTransform } from '@angular/core';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'notEmptyValues',
  pure: true,
})
export class FormNotEmptyValuesPipe implements PipeTransform {
  transform(formGroup: FormGroup): Observable<number> {
    return formGroup.valueChanges.pipe(
      startWith(formGroup.value),
      debounceTime(300),
      map((formValue) => Object.values(formValue).filter((x) => !!x).length),
    );
  }
}
