import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageResourcesListComponent } from './page-resources-list.component';
import { TestingModule } from '@eunice/testing';

describe('PageResourcesListComponent', () => {
  let component: PageResourcesListComponent;
  let fixture: ComponentFixture<PageResourcesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageResourcesListComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageResourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
