import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceEditFormComponent } from './resource-edit-form.component';
import { provideAuthenticatedUser, TestingModule } from '@eunice/testing';

describe(ResourceEditFormComponent.name, () => {
  let component: ResourceEditFormComponent;
  let fixture: ComponentFixture<ResourceEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, ResourceEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
