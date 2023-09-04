import {
  provideReuniceTable,
  ReuniceAbstractTable,
} from './reunice-abstract-table.directive';
import { BaseResource, PageService } from '@reunice/modules/shared/data-access';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TestingModule } from '@reunice/testing';
import { expect } from '@jest/globals';
import { BaseTableImportsModule } from '../base-table-imports.module';
import { TableStorageKeys } from '../constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LOCAL_STORAGE } from '@ng-web-apis/common';

// eslint-disable-next-line @angular-eslint/use-component-selector,@angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'test-component',
  template: `
    <table
      tuiTable
      tuiSortBy
      [columns]="columns"
      *tuiLet="items$ | async as items"
    >
      <thead>
        <tr tuiThGroup>
          <th *tuiHead="'id'" tuiTh tuiSortable [sticky]="true">Id</th>
        </tr>
      </thead>

      <tbody tuiTbody>
        <tr *ngFor="let item of items" tuiTr>
          <td *tuiCell="'id'" tuiTd>
            {{ item.id }}
          </td>
        </tr>
      </tbody>
    </table>

    <tui-table-pagination
      [total]="(total$ | async) ?? 0"
    ></tui-table-pagination>
  `,
  providers: [provideReuniceTable(PageService)],
})
class TestComponent extends ReuniceAbstractTable<BaseResource> {
  readonly columns: Array<keyof BaseResource | string> = [];
  readonly filtersForm = new FormGroup({});
}

describe(ReuniceAbstractTable.name, () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestingModule, BaseTableImportsModule],
      declarations: [TestComponent],
      providers: [
        {
          provide: LOCAL_STORAGE,
          useValue: {
            setItem: jest.fn(),
            getItem: () => null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save pagination to local storage', async () => {
    const spy = jest.spyOn(component['_storage'], 'setItem');

    component['_pagination']!.paginationChange.emit({ size: 50, page: 0 });

    expect(spy).toHaveBeenCalledWith(
      TableStorageKeys.PageSize,
      (50).toString(),
    );
  });
});
