import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { University } from '../../../../modules/shared/data-access/src/lib/models/university';
import { map, Observable, startWith } from 'rxjs';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UniversityService } from '../../../../modules/shared/data-access/src/lib/services/university.service';
import { UserService } from '../../../../modules/shared/data-access/src/lib/services/user.service';
import { User } from '../../../../modules/shared/data-access/src/lib/models/user';

@Component({
  selector: 'reunice-university-selector',
  templateUrl: './university-selector.component.html',
  styleUrls: ['./university-selector.component.scss'],
})
export class UniversitySelectorComponent implements OnInit {
  @Output() universityChanged = new EventEmitter<University>();
  universityControl = new FormControl<string | University>('', [
    this.objectTypeValidator(),
  ]);
  options: University[] = [];
  filteredOptions!: Observable<University[]>;

  constructor(
    private universityService: UniversityService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUniversities();
    this.universityControl.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.universityChanged.emit(this.universityControl.value as University);
      } else {
        this.universityChanged.emit(undefined);
      }
    });

    this.filteredOptions = this.universityControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }

  private objectTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = typeof control.value === 'object';
      return valid ? null : { forbiddenType: { value: control.value } };
    };
  }

  loadUniversities() {
    if (this.userService.loggedUser) {
      const loggedUser: User = this.userService.loggedUser;
      if (loggedUser.accountType === 'ADMIN') {
        this.universityService.getUniversities().subscribe((res) => {
          this.options = res;
          this.universityControl.setValue('');
        });
      } else {
        this.options = this.userService.loggedUser?.enrolledUniversities ?? [];
        this.universityControl.setValue('');
      }
    }
  }

  displayFn(university: University): string {
    return university && university.name ? university.name : '';
  }

  private _filter(name: string): University[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  clearValue() {
    this.universityControl.setValue(null);
  }
}
