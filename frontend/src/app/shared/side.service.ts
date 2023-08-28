import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

@Injectable({
  providedIn: 'root',
})
export class SideService {
  private readonly _rightSide = new BehaviorSubject<PolymorpheusContent | null>(
    null,
  );
  private readonly _leftSide = new BehaviorSubject<PolymorpheusContent | null>(
    null,
  );

  readonly rightSide$ = this._rightSide.asObservable();
  readonly leftSide$ = this._leftSide.asObservable();

  setRightSide(content: PolymorpheusContent | null): void {
    this._rightSide.next(content);
  }

  setLeftSide(content: PolymorpheusContent | null): void {
    this._leftSide.next(content);
  }
}
