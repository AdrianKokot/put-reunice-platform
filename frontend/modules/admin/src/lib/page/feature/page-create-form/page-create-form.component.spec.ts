import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageCreateFormComponent } from './page-create-form.component';
import { TestingModule, provideAuthenticatedUser } from '@eunice/testing';

describe(PageCreateFormComponent.name, () => {
  let component: PageCreateFormComponent;
  let fixture: ComponentFixture<PageCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, PageCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
