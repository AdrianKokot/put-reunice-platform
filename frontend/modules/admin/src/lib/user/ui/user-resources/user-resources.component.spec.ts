import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserResourcesComponent } from './user-resources.component';
import { TestingModule } from '@reunice/testing';

describe('UserFilesComponent', () => {
  let component: UserResourcesComponent;
  let fixture: ComponentFixture<UserResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserResourcesComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
