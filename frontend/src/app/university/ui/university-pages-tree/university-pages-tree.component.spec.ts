import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityPagesTreeComponent } from './university-pages-tree.component';
import { TestingModule } from '@reunice/testing';

describe(UniversityPagesTreeComponent.name, () => {
  let component: UniversityPagesTreeComponent;
  let fixture: ComponentFixture<UniversityPagesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, UniversityPagesTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityPagesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
