import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAuthenticatedUser, TestingModule } from '@reunice/testing';
import { GlobalPageDetailsComponent } from './global-page-details.component';

describe(GlobalPageDetailsComponent.name, () => {
  let component: GlobalPageDetailsComponent;
  let fixture: ComponentFixture<GlobalPageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideAuthenticatedUser()],
      imports: [TestingModule, GlobalPageDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalPageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
