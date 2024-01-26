import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBasicInformationComponent } from './user-basic-information.component';
import { TestingModule } from '@eunice/testing';

describe('UserBasicInformationComponent', () => {
  let component: UserBasicInformationComponent;
  let fixture: ComponentFixture<UserBasicInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBasicInformationComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBasicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
