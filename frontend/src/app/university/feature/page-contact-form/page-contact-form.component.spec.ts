import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageContactFormComponent } from './page-contact-form.component';
import { TestingModule } from '@reunice/testing';

describe('PageContactFormComponent', () => {
  let component: PageContactFormComponent;
  let fixture: ComponentFixture<PageContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContactFormComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
