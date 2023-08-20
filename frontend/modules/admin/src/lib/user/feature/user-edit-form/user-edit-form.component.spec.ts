import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditFormComponent } from './user-edit-form.component';
import { TestingModule } from '@reunice/testing';

describe(UserEditFormComponent.name, () => {
  let component: UserEditFormComponent;
  let fixture: ComponentFixture<UserEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UserEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
