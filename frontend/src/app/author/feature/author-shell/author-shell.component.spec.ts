import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorShellComponent } from './author-shell.component';
import { TestingModule } from '@eunice/testing';

describe('AuthorShellComponent', () => {
  let component: AuthorShellComponent;
  let fixture: ComponentFixture<AuthorShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorShellComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
