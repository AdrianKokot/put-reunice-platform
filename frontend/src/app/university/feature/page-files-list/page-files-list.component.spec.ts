import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageFilesListComponent } from './page-files-list.component';
import { TestingModule } from '@reunice/testing';

describe('PageFilesListComponent', () => {
  let component: PageFilesListComponent;
  let fixture: ComponentFixture<PageFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFilesListComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
