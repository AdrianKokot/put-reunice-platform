import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageResourcesComponent } from './page-resources.component';
import { TestingModule } from '@reunice/testing';

describe('UserFilesComponent', () => {
  let component: PageResourcesComponent;
  let fixture: ComponentFixture<PageResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageResourcesComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
