import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileShellComponent } from './profile-shell.component';
import { TestingModule } from '@reunice/testing';

describe(ProfileShellComponent.name, () => {
  let component: ProfileShellComponent;
  let fixture: ComponentFixture<ProfileShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, ProfileShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
