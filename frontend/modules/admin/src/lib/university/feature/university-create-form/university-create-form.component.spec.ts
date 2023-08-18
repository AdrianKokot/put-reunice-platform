import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityCreateFormComponent } from './university-create-form.component';
import { TestingModule } from '@reunice/testing';

describe(UniversityCreateFormComponent.name, () => {
  let component: UniversityCreateFormComponent;
  let fixture: ComponentFixture<UniversityCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UniversityCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
