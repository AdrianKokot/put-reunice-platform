import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateCreateFormComponent } from './template-create-form.component';
import { TestingModule } from '@reunice/testing';

describe('TemplateCreateFormComponent', () => {
  let component: TemplateCreateFormComponent;
  let fixture: ComponentFixture<TemplateCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, TemplateCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
