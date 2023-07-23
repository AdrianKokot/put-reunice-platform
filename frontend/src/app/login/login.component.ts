import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'modules/shared/data-access/src/lib/services/user.service';
import { ErrorHandlerService } from '@reunice/modules/shared/data-access';
import { DialogService } from '../../assets/service/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reunice-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user = {} as { username: string; password: string };
  showSpinner = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.userService.loggedUser) {
      this.router.navigateByUrl('/');
    }
  }

  login(): void {
    this.userService.login(this.user).subscribe({
      next: () => {
        this.userService.getLoggedUser().subscribe({
          next: (user) => {
            this.userService.loggedUser = user;
            window.location.reload();
          },
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.user = { username: '', password: '' };
          this.dialogService.openErrorDialog(
            err.message
              ? this.translateService.instant(err.message)
              : this.translateService.instant('ERRORS.401')
          );
        } else this.errorHandler.handleError(err);
      },
    });
  }
}
