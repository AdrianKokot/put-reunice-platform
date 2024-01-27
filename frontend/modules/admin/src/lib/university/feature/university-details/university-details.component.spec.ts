import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityDetailsComponent } from './university-details.component';
import { TestingModule } from '@eunice/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe(UniversityDetailsComponent.name, () => {
  let component: UniversityDetailsComponent;
  let fixture: ComponentFixture<UniversityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UniversityDetailsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
