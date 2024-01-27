import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPagesComponent } from './user-pages.component';
import { TestingModule } from '@eunice/testing';

describe('UserPagesComponent', () => {
  let component: UserPagesComponent;
  let fixture: ComponentFixture<UserPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPagesComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
