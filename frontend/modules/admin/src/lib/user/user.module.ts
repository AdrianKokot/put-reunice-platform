import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './feature/user-list/user-list.component';

@NgModule({
  imports: [CommonModule, UserRoutingModule],
})
export default class UserModule {}
