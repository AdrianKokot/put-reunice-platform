import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeywordCreateFormComponent } from './keyword-create-form.component';
import { TestingModule } from '@reunice/testing';

describe('KeywordCreateFormComponent', () => {
  let component: KeywordCreateFormComponent;
  let fixture: ComponentFixture<KeywordCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, KeywordCreateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
