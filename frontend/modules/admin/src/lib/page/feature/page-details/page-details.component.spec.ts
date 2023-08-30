import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageDetailsComponent } from './page-details.component';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';

describe(PageDetailsComponent.name, () => {
  let component: PageDetailsComponent;
  let fixture: ComponentFixture<PageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
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
