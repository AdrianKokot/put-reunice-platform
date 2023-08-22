import { NgForTrackByIdDirective } from './ng-for-track-by-id.directive';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'test-component',
  standalone: true,
  imports: [CommonModule, NgForTrackByIdDirective],
  template: `
    <div *ngFor="let item of items; trackById">
      {{ item.id }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
  items = [
    { id: '1', value: 'Item 1' },
    { id: '2', value: 'Item 2' },
  ];
}

describe(NgForTrackByIdDirective.name, () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: NgForTrackByIdDirective<{ id: string; value: string }>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.css('div'))
      .injector.get(NgForTrackByIdDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set ngForTrackBy function', () => {
    const ngFor = fixture.debugElement
      .query(By.css('div'))
      .injector.get(NgForOf);

    expect(ngFor.ngForTrackBy).toBeTruthy();
    expect(typeof ngFor.ngForTrackBy).toEqual('function');
    expect(ngFor.ngForTrackBy(0, { id: '1' })).toEqual('1');
    expect(ngFor.ngForTrackBy(1, { id: '2' })).toEqual('2');
  });

  it('should render items with correct IDs', () => {
    const renderedItems = fixture.debugElement.queryAll(By.css('div'));

    expect(renderedItems.length).toEqual(2);
    expect(renderedItems[0].nativeElement.textContent).toContain('1');
    expect(renderedItems[1].nativeElement.textContent).toContain('2');
  });
});
