import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardShellComponent } from './dashboard-shell.component';
import { TestingModule } from '@eunice/testing';

describe(DashboardShellComponent.name, () => {
  let component: DashboardShellComponent;
  let fixture: ComponentFixture<DashboardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, DashboardShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
