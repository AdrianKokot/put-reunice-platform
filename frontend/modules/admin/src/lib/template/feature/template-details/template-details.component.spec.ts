import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateDetailsComponent } from './template-details.component';
import { TestingModule } from '@reunice/testing';
import { TUI_SANITIZER } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

describe(TemplateDetailsComponent.name, () => {
  let component: TemplateDetailsComponent;
  let fixture: ComponentFixture<TemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, TemplateDetailsComponent],
      providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
