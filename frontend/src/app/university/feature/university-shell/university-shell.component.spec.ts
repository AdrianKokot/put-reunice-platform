import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityShellComponent } from './university-shell.component';
import { TestingModule } from '@reunice/testing';

describe(UniversityShellComponent.name, () => {
  let component: UniversityShellComponent;
  let fixture: ComponentFixture<UniversityShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UniversityShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
