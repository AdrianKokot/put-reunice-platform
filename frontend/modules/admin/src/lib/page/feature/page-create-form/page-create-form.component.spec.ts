import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageCreateFormComponent } from './page-create-form.component';
import { TestingModule } from '@reunice/testing';

describe('PageCreateFormComponent', () => {
  let component: PageCreateFormComponent;
  let fixture: ComponentFixture<PageCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, PageCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
