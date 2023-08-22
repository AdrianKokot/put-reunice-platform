import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginShellComponent } from './login-shell.component';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe(LoginShellComponent.name, () => {
  let component: LoginShellComponent;
  let fixture: ComponentFixture<LoginShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TuiErrorModule,
        TuiInputModule,
        FormsModule,
        ReactiveFormsModule,
        TuiFieldErrorPipeModule,
        TuiInputPasswordModule,
        TuiButtonModule,
        TuiTextfieldControllerModule,
        TuiLabelModule,
        TuiAutoFocusModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      declarations: [LoginShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
