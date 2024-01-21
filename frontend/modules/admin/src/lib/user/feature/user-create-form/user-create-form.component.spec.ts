import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateFormComponent } from './user-create-form.component';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';

describe(UserCreateFormComponent.name, () => {
  let component: UserCreateFormComponent;
  let fixture: ComponentFixture<UserCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, UserCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
