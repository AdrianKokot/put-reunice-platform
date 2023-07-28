import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityListComponent } from './university-list.component';
import { TestingModule } from '@reunice/testing';

describe('UniversityListComponent', () => {
  let component: UniversityListComponent;
  let fixture: ComponentFixture<UniversityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UniversityListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
