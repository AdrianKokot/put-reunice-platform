import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileChangePasswordComponent } from './profile-change-password.component';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';

describe(ProfileChangePasswordComponent.name, () => {
  let component: ProfileChangePasswordComponent;
  let fixture: ComponentFixture<ProfileChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, ProfileChangePasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
