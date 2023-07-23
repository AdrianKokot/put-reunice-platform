import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'modules/shared/data-access/src/lib/models/page';
import { University } from 'modules/shared/data-access/src/lib/models/university';
import { User } from 'modules/shared/data-access/src/lib/models/user';
import { PageService } from '../../../modules/shared/data-access/src/lib/services/page.service';
import { UserService } from 'modules/shared/data-access/src/lib/services/user.service';
import { ErrorHandlerService } from '../../../modules/shared/data-access/src/lib/services/error-handler.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../../assets/service/dialog.service';
import { UniversityService } from '../../../modules/shared/data-access/src/lib/services/university.service';

@Component({
  selector: 'reunice-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  logged = false;
  public userLogged!: User | null;
  imageSrc = 'src/assets/images/logo.jpg';
  universities: University[] = [];
  users: User[] = [];
  pages: Page[] = [];
  public isOnPage = RegExp('page/');

  constructor(
    public router: Router,
    private pageService: PageService,
    private userService: UserService,
    private dialogService: DialogService,
    private universityService: UniversityService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.userService.loggedUser) {
      this.userLogged = this.userService.loggedUser;
      this.logged = true;
    } else {
      this.userLogged = null;
      this.logged = false;
    }

    if (localStorage.getItem('language') == 'en') {
      this.translate_to_en();
    }
    if (localStorage.getItem('language') == 'pl') {
      this.translate_to_pl();
    }
  }

  translate_to_en() {
    this.translate.use('en');
    localStorage.setItem('language', 'en');
  }

  translate_to_pl() {
    this.translate.use('pl');
    localStorage.setItem('language', 'pl');
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.logged = false;
        this.userLogged = null;
        this.userService.loggedUser = null;
        window.location.replace('');
      },
    });
  }

  toggleSidenav() {
    this.pageService.sidenavToggled.emit();
  }
}
