import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserService } from '@reunice/modules/shared/data-access';
import { CommonModule } from '@angular/common';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLinkModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'reunice-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TuiLetModule,
    TuiTableModule,
    TuiLinkModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly _userService = inject(UserService);

  readonly columns = [
    'name',
    'firstName',
    'lastName',
    'role',
    'active',
    'actions',
  ];

  readonly users$ = this._userService.getUsers();
}
