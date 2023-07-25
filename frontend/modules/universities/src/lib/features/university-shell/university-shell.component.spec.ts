import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityShellComponent } from './university-shell.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateModule } from "@ngx-translate/core";

describe('UniversityShellComponent', () => {
  let component: UniversityShellComponent;
  let fixture: ComponentFixture<UniversityShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [UniversityShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
