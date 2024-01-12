import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@reunice/testing';
import { MainPageComponent } from './main-page.component';

describe(MainPageComponent.name, () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, MainPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
