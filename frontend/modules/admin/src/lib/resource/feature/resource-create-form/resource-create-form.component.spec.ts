import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceCreateFormComponent } from './resource-create-form.component';
import { provideAuthenticatedUser, TestingModule } from '@eunice/testing';

describe(ResourceCreateFormComponent.name, () => {
  let component: ResourceCreateFormComponent;
  let fixture: ComponentFixture<ResourceCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, ResourceCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
