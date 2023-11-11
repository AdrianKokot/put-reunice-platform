import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFilesComponent } from './user-files.component';
import { TestingModule } from '@reunice/testing';

describe('UserFilesComponent', () => {
  let component: UserFilesComponent;
  let fixture: ComponentFixture<UserFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilesComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
