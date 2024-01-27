import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalPageListComponent } from './global-page-list.component';
import { TestingModule } from '@eunice/testing';

describe(GlobalPageListComponent.name, () => {
  let component: GlobalPageListComponent;
  let fixture: ComponentFixture<GlobalPageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, GlobalPageListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
