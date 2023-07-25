import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageDetailsComponent } from './page-details.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";

describe('PageDetailsComponent', () => {
  let component: PageDetailsComponent;
  let fixture: ComponentFixture<PageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [PageDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
