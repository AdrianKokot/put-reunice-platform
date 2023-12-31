import { Directive, Input, NgIterable, Self } from '@angular/core';
import { NgForOf } from '@angular/common';

@Directive({
  selector: '[ngFor][ngForOf], [ngFor][ngForOf][ngForTrackById]',
  standalone: true,
})
export class NgForTrackByIdDirective<T extends { id: string | number }> {
  @Input() ngForOf!: NgIterable<T> | null | undefined;

  constructor(@Self() ngFor: NgForOf<T>) {
    if (ngFor.ngForTrackBy === undefined) {
      ngFor.ngForTrackBy = (_: number, item: T) => item.id;
    }
  }
}
