import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateDetailsComponent } from './template-details.component';
import { TestingModule } from '@eunice/testing';

describe(TemplateDetailsComponent.name, () => {
  let component: TemplateDetailsComponent;
  let fixture: ComponentFixture<TemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, TemplateDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
