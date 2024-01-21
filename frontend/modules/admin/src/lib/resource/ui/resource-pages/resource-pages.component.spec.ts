import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourcePagesComponent } from './resource-pages.component';
import { TestingModule } from '@reunice/testing';

describe('ResourcePagesComponent', () => {
  let component: ResourcePagesComponent;
  let fixture: ComponentFixture<ResourcePagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcePagesComponent, TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
