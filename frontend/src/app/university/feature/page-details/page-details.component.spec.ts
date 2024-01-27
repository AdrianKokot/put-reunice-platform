import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageDetailsComponent } from './page-details.component';
import { TestingModule } from '@eunice/testing';

describe(PageDetailsComponent.name, () => {
  let component: PageDetailsComponent;
  let fixture: ComponentFixture<PageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, PageDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
