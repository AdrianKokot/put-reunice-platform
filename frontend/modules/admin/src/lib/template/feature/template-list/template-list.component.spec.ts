import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateListComponent } from './template-list.component';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';

describe(TemplateListComponent.name, () => {
  let component: TemplateListComponent;
  let fixture: ComponentFixture<TemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, TemplateListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
