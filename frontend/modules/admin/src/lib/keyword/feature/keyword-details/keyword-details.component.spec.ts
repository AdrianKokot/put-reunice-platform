import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeywordDetailsComponent } from './keyword-details.component';
import { TestingModule } from '@reunice/testing';

describe(KeywordDetailsComponent.name, () => {
  let component: KeywordDetailsComponent;
  let fixture: ComponentFixture<KeywordDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, KeywordDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeywordDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
