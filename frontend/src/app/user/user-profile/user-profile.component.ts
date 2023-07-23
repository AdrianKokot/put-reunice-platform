import { Component, OnInit } from '@angular/core';
import { User } from 'modules/shared/data-access/src/lib/models/user';

import { UserService } from 'modules/shared/data-access/src/lib/services/user.service';
import { DialogService } from '../../../assets/service/dialog.service';

@Component({
  selector: 'reunice-user-settings',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public user!: User;

  constructor(
    private dialogService: DialogService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.userService.getLoggedUser().subscribe({
      next: (res) => {
        this.user = res;
      },
    });
  }
}
