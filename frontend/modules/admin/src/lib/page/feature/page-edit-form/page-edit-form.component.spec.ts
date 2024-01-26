import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEditFormComponent } from './page-edit-form.component';
import { provideAuthenticatedUser, TestingModule } from '@eunice/testing';

describe(PageEditFormComponent.name, () => {
  let component: PageEditFormComponent;
  let fixture: ComponentFixture<PageEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, PageEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
