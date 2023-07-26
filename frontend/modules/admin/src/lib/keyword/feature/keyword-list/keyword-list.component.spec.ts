import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeywordListComponent } from './keyword-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('KeywordListComponent', () => {
  let component: KeywordListComponent;
  let fixture: ComponentFixture<KeywordListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        KeywordListComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
