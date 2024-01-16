import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';
import { GlobalPageEditFormComponent } from './global-page-edit-form.component';

describe(GlobalPageEditFormComponent.name, () => {
  let component: GlobalPageEditFormComponent;
  let fixture: ComponentFixture<GlobalPageEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, GlobalPageEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalPageEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
