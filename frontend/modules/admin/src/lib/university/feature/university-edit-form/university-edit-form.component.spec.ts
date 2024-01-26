import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityEditFormComponent } from './university-edit-form.component';
import { TestingModule } from '@eunice/testing';

describe(UniversityEditFormComponent.name, () => {
  let component: UniversityEditFormComponent;
  let fixture: ComponentFixture<UniversityEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UniversityEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
