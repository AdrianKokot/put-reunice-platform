import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateEditFormComponent } from './template-edit-form.component';
import { TestingModule } from '@reunice/testing';

describe(TemplateEditFormComponent.name, () => {
  let component: TemplateEditFormComponent;
  let fixture: ComponentFixture<TemplateEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, TemplateEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
