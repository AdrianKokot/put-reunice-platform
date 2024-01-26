import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '@eunice/testing';
import { GlobalPageCreateFormComponent } from './global-page-create-form.component';

describe(GlobalPageCreateFormComponent.name, () => {
  let component: GlobalPageCreateFormComponent;
  let fixture: ComponentFixture<GlobalPageCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, GlobalPageCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalPageCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
