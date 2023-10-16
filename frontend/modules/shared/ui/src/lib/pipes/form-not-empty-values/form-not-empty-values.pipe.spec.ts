import { TestBed } from '@angular/core/testing';
import { FormNotEmptyValuesPipe } from './form-not-empty-values.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe(FormNotEmptyValuesPipe.name, () => {
  let pipe: FormNotEmptyValuesPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormNotEmptyValuesPipe],
    });

    pipe = TestBed.inject(FormNotEmptyValuesPipe);
  });

  it('should transform formGroup value changes to the count of non-empty values', (done) => {
    const formGroup = new FormGroup({
      field1: new FormControl('Value 1'),
      field2: new FormControl(''),
      field3: new FormControl(null),
    });

    pipe.transform(formGroup).subscribe((count) => {
      expect(count).toBe(1);
      done();
    });
  });

  it('should handle formGroup with no controls', (done) => {
    const formGroup = new FormGroup({});

    pipe.transform(formGroup).subscribe((count) => {
      expect(count).toBe(0);
      done();
    });
  });

  it('should handle formGroup with all empty controls', (done) => {
    const formGroup = new FormGroup({
      field1: new FormControl(''),
      field2: new FormControl(''),
    });

    pipe.transform(formGroup).subscribe((count) => {
      expect(count).toBe(0);
      done();
    });
  });

  it('should handle formGroup with mixed empty and non-empty controls', (done) => {
    const formGroup = new FormGroup({
      field1: new FormControl('Value 1'),
      field2: new FormControl(''),
      field3: new FormControl(null),
      field4: new FormControl('Value 4'),
    });

    pipe.transform(formGroup).subscribe((count) => {
      expect(count).toBe(2);
      done();
    });
  });
});
