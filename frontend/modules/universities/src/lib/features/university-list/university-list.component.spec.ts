import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversityListComponent } from './university-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

describe('UniversityListComponent', () => {
  let component: UniversityListComponent;
  let fixture: ComponentFixture<UniversityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [UniversityListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
