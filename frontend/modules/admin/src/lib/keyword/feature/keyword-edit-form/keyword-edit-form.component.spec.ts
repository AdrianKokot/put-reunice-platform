import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeywordEditFormComponent } from './keyword-edit-form.component';
import { TestingModule } from '@reunice/testing';

describe('KeywordEditFormComponent', () => {
  let component: KeywordEditFormComponent;
  let fixture: ComponentFixture<KeywordEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, KeywordEditFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
