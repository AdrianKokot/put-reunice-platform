import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardTilesComponent } from './dashboard-tiles.component';
import { TestingModule } from '@eunice/testing';

describe(DashboardTilesComponent.name, () => {
  let component: DashboardTilesComponent;
  let fixture: ComponentFixture<DashboardTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, DashboardTilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
