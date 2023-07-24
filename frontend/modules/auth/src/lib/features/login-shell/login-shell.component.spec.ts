import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginShellComponent } from './login-shell.component';

describe('LoginShellComponent', () => {
  let component: LoginShellComponent;
  let fixture: ComponentFixture<LoginShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
