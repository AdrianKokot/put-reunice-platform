import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableFilterComponent } from './table-filter.component';
import { TestingModule } from '@eunice/testing';

describe('TableFilterComponent', () => {
  let component: TableFilterComponent;
  let fixture: ComponentFixture<TableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, TableFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
