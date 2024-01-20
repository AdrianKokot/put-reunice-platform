import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceListComponent } from './resource-list.component';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';

describe(ResourceListComponent.name, () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, ResourceListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
