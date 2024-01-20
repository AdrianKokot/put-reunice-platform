import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceDetailsComponent } from './resource-details.component';
import { TestingModule } from '@reunice/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe(ResourceDetailsComponent.name, () => {
  let component: ResourceDetailsComponent;
  let fixture: ComponentFixture<ResourceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, ResourceDetailsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
