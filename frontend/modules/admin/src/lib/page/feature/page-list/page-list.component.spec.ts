import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageListComponent } from './page-list.component';
import { TestingModule } from '@reunice/testing';

describe(PageListComponent.name, () => {
  let component: PageListComponent;
  let fixture: ComponentFixture<PageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, PageListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
