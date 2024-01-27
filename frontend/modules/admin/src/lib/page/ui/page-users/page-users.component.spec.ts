import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageUsersComponent } from './page-users.component';
import { TestingModule } from '@eunice/testing';

describe('PageUsersComponent', () => {
  let component: PageUsersComponent;
  let fixture: ComponentFixture<PageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageUsersComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
