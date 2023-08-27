import { AuthService } from '@reunice/modules/shared/security';
import { User } from '@reunice/modules/shared/data-access';
import { Provider } from '@angular/core';

export const provideAuthenticatedUser = (
  user: Partial<User> = {
    id: 0,
    phoneNumber: '123123123',
    email: 'test@user.com',
    firstName: 'TEST',
    lastName: 'TEST',
    accountType: 'USER',
    enrolledUniversities: [],
    username: 'test',
    enabled: true,
  }
): Provider => ({
  provide: AuthService,
  useValue: {
    userSnapshot: user,
  },
});
