import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileFormComponent } from './profile-form.component';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';

describe(ProfileFormComponent.name, () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, ProfileFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
