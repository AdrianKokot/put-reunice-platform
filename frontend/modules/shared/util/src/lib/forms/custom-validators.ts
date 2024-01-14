import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static crossFieldValidation(
    whenField: string,
    hasValue: unknown,
    thenFields: string[],
    hasValidator: ValidatorFn,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const whenControl = control.get(whenField);
      if (whenControl === null) {
        return null;
      }

      if (whenControl.value === hasValue) {
        thenFields.forEach((thenField) => {
          const thenControl = control.get(thenField);
          thenControl?.addValidators(hasValidator);
        });
      } else {
        thenFields.forEach((thenField) => {
          const thenControl = control.get(thenField);
          thenControl?.removeValidators(hasValidator);
        });
      }

      return null;
    };
  }
}
